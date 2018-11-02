import React, { Component } from "react";
import io  from "socket.io-client";
import { connect } from "react-redux";
import { UserReducer } from "../../reducers";
import Auth from "../../auth/Auth";
import { updateAuth } from "../../actions/user-actions";


interface DashboardProps {
    history: History,
    updateAuth: any
}

class Dashboard extends Component<DashboardProps, {}> {
    private socket:any;

    constructor(props: any) {
        super(props);
        this.socket = null;
    }

    render() {
        let auth = new Auth(this.props.history);
        auth.handleAuthentication();
        return (
            <div className="page-content">
                <h1>Congrats! You reached the dashboard!</h1>
                <button onClick={()=> this.connectToServer()}>Connect to server</button>
                <button onClick={()=> this.generateTestCharacter()}>Generate test character</button>
                <button onClick={()=> this.logout()}>Click me to log out</button>
            </div>
        )
    }

    logout() {
        console.log("you are logging out");
        let auth = new Auth(this.props.history);
        auth.logout();
        this.props.updateAuth(auth);
    }

    send(msg:string){
        this.socket.emit('greeting', {msg: msg});
    }

    connectToServer() {
        console.log('connecting to server!');
        let skt = io.connect("http://localhost:8080");
        let credentials = this.generateCredentials();
        skt.on('connect', function(){
            console.log('connection established');
            skt.emit('authentication', credentials);
            skt.on('authenticated', function() {
                console.log('authenticated!');
                // Add handlers for different types of events here (I think)
                // Until the socket receives an 'authenticated' event, it 
                // shouldn't be sending any more events to the server.
                skt.on('data.retrieved', function(event:any){
                    console.log('data retrieved: ' + JSON.stringify(event,null,2));
                    if(event.data.id !== undefined){
                        localStorage.setItem('userid', event.data.id);
                    }
                });

                skt.on('data.persisted', function(event:any){
                    console.log('data persisted: ' + JSON.stringify(event,null,2));
                });

                skt.on('app.error', function(event:any){
                    console.log('error: ' + JSON.stringify(event,null,2));
                });
            });
            skt.on('unauthorized', function(data:any){
                console.log('authorization failed: ' + JSON.stringify(data,null,2));
                skt.disconnect();
            });
            skt.on('disconnect', function(){
                console.log('connection lost');
            });
        });
        this.socket = skt;
    }

    generateTestCharacter(){
        console.log("generating a test character");
        if(this.socket === null){
            console.log("no server connection!");
        } else if(localStorage.getItem('userid') === null){
            console.log("no user id available!");
        } else {
            let event = {
                namespace: "character",
                key: "new_character",
                data: {
                    name: "Billy Bob",
                    userid: localStorage.getItem('userid')
                }
            }
            this.socket.emit('data.persist', event);
        }
    }

    generateCredentials():any {
        let credentials = {
            access_token: localStorage.getItem('access_token'),
            id_token: localStorage.getItem('id_token'),
            expires_at: localStorage.getItem('expires_at')
        }
        return credentials;
    }
}

const mapActionsToProps = {
    updateAuth
}

export default connect(UserReducer, mapActionsToProps)(Dashboard);