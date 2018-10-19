export default class ClientConnection{
    private id:string;
    private nickname:string;
    private socket:any;

    constructor(id:string, nickname:string, socket:any){
        this.id = id;
        this.nickname = nickname;
        this.socket = socket;
    }

    getId():string{
        return this.id;
    }

    getNickname():string{
        return this.nickname;
    }

    getSocket():any{
        return this.socket;
    }
}