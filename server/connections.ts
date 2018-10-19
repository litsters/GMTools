import ClientConnection from "./clientconnection";

export default class Connections {
    private connectionMap: Map<string, Map<string, ClientConnection>>;  // Each userid is associated with a set of connections, each of which is also identified by its socket id.

    constructor(){
        this.connectionMap = new Map();
    }

    addConnection(connection:ClientConnection){
        let id = connection.getId();
        let connections: Map<string, ClientConnection>;
        // Get the connections for this user
        if(this.connectionMap.has(id)){
            connections = this.connectionMap.get(id);
        } else {
            connections = new Map();
        }

        // Associate this connection with its socket id
        let socketid:string = connection.getSocket().id;
        connections.set(socketid, connection);

        // Update the saved connections for the user.
        this.connectionMap.set(id, connections);
    }

    removeConnection(socketid:string):void {
        let connection = this.getConnection(socketid);
        if(connection !== null){
            // The connection was found
            let userid = connection.getId();
            let connections = this.getConnections(userid);
            connections.delete(socketid);
            if(connections.size > 0){
                this.connectionMap.set(userid, connections);
            } else {
                this.connectionMap.delete(userid);
            }
        }
    }

    getConnections(userid: string): Map<string, ClientConnection>{
        if(this.connectionMap.has(userid)){
            return this.connectionMap.get(userid);
        } else return null;
    }

    getConnection(socketid: string): ClientConnection {
        for(let userid of this.connectionMap.keys()){
            // Get connections for the user
            let connections = this.connectionMap.get(userid);
            // Check all of them for the target socket
            for(let skt of connections.keys()){
                let connection = connections.get(skt);
                if(skt === socketid) return connection;
            }
        }
        return null;
    }

    print(){
        console.log(this.connectionMap);
    }
}