import express from "express";
import bodyParser from "body-parser";
import { AuthApi } from "./api";
import socketIOAuth from "socketio-auth";
import jwt from "jsonwebtoken";
import fs from "fs";
import Token from "./token";
import Connections from "./connections";
import ClientConnection from "./clientconnection";

const port = 8080;
const key = 'gm-tools.pem';
const iss = 'https://gm-tools.auth0.com/';      // This is the issuer's domain
const aud = '5j5hV3sMFUstdIOijBgVxGWuSw059kBQ'; // This is the client ID for auth0

// Set up the connection tracker
const connections = new Connections();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Allow CORS for localhost:3000 for development purposes
app.use(function(req:any, res:any, next:any){
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Origin", "Origin, X-Requested-With, Content-Type, Accept");
});

// API Registration
AuthApi(app);

// HTML Server
app.use('/', express.static(__dirname + '/public'));

// Socket server
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Authentication function
const authenticate = async (client:any, data:any, callback:any) => {
    // validate credentials
    // Verify that token hasn't expired
    if(!data.expires_at) return callback(new Error("Invalid credentials"));
    else if(data.expires_at < new Date().getTime()){
        return callback(new Error("Invalid credentials"));
    } 

    // Verify that access token is valid
    if(!data.id_token) return callback(new Error("Invalid credentials"));
    else {
        try{
            let options = {
                algorithms: ['RS256'],
                issuer: iss,
                audience: aud
            };
            let cert = fs.readFileSync(key);
            let decoded = jwt.verify(data.id_token, cert, options);
            // Cast decoded to a Token to make it easier to work with
            let token = (<Token> decoded);
            
            // Add authenticated socket to connections
            let connection = new ClientConnection(token["https://gm-tools.com/user_id"], token["https://gm-tools.com/nickname"], client);
            connections.addConnection(connection);
            // connections.print();
        }catch(err){
            console.log(JSON.stringify(err,null,2));
            return callback(new Error("Invalid credentials"));
        }
    }

    return callback(null, true);
};

// Register handlers
const postAuthenticate = (client:any) => {
    client.on('greeting', function(data:any){
        console.log(JSON.stringify(data,null,2));
    })
}

// Clean up function
const disconnect = (client:any) => {
    // remove socket from connection list
    connections.removeConnection(client.id);
    // connections.print();
}

// Configure authentication
socketIOAuth(io, {authenticate, postAuthenticate, disconnect, timeout: "none"});

// Start Server
server.listen(port, function () {
    console.log(`Server is started on port ${process.env.PORT || port}`);
});