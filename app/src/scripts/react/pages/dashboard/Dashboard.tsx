import React, { Component } from "react";

import io  from "socket.io-client";

import { connect } from "react-redux";
import { UserReducer } from "../../reducers";


interface DashboardProps {
    history: History,
    user: any
}

class Dashboard extends Component<DashboardProps, {}> {
    private socket:any;

    constructor(props: any) {
        super(props);
        this.socket = null;
    }

    render() {
        this.props.user.auth.handleAuthentication();
        return (
            <div className="page-content">
                <h1>Congrats! You reached the dashboard!</h1>
                <button onClick={()=> this.connectToServer()}>Connect to server</button>
                <button onClick={()=> this.logout()}>Click me to log out</button>
            </div>
        )
    }

    logout() {
        console.log("you are logging out");
        this.props.user.auth.logout();
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

    generateCredentials():any {
        let credentials = {
            access_token: localStorage.getItem('access_token'),
            id_token: localStorage.getItem('id_token'),
            expires_at: localStorage.getItem('expires_at')
        }
        return credentials;
    }
}

export default connect(UserReducer)(Dashboard);
