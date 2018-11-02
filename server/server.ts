import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import socketIOAuth from "socketio-auth";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import Token from "./token";
import Connections from "./connections";
import ClientConnection from "./clientconnection";
import Handlers from "./handlers";
import CharacterHandler from "./character_handler";
import CampaignHandler from "./campaign_handler";
import registerAPIs from "./api";
import { registerPluginAssetServer } from "./plugins";

const port = 8080;
const key = 'gm-tools.pem';
const iss = 'https://gm-tools.auth0.com/';      // This is the issuer's domain
const aud = '5j5hV3sMFUstdIOijBgVxGWuSw059kBQ'; // This is the client ID for auth0

// Set up the connection tracker
const connections = new Connections();

const __serverDir = __dirname + (path.basename(__dirname) === "dist" ? "/../" : "");
const __publicDir = path.join(__serverDir, "/dist/public");

import models from './db/models';

import { IUser } from "./db/schemas/user";
import EventWrapper from "./event";

models.User.count({})
  .then( (count:number) => console.log(`Found ${count} characters`) );

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// API Registration
registerAPIs(app);

// HTML Server
app.use('/static', express.static(path.join(__publicDir, "/static")));
registerPluginAssetServer(app);
app.get('/*', (request:Request, response:Response) => {
    response.sendFile(path.join(__publicDir, "/index.html"));
});

// Set up event handler modules
const handler_modules = new Handlers();
handler_modules.addHandler(new CharacterHandler("character"));
handler_modules.addHandler(new CampaignHandler("campaign"));

// Socket server
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// This is just a general function for sending errors to a socket to avoid
// needing to copy and paste a hundred times.
const sendError = (socket:any, error:any) => {
    let event = {
        error: "An internal error occurred.",
        details: {
            error: error
        }
    };
    socket.emit("app.error", event);
}

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
    // Get user information
    let socketid = client.id;
    let connection = connections.getConnection(socketid);
    let userid = connection.getId();

    models.User.findOne({id: userid}).then(function(user:IUser){
        if(user !== null){
            // If user is not null, send it to client
            // console.log("user data retrieved!");
            // console.log(JSON.stringify(user,null,2));
            let event = {
                namespace: "user",
                key: "current-data",
                data: user
            };
            client.emit('data.retrieved', event);
        } else {
            // Else, create new user and sent to client
            // console.log("no user data available");
            let nickname = connection.getNickname();
            models.User.create({id: userid, nickname: nickname}).then(function(user:IUser){
                // console.log("successful create: " + JSON.stringify(user,null,2));
                let event = {
                    namespace: "user",
                    key: "current-data",
                    data: user
                };
                client.emit('data.retrieved', event);
            }).catch(function(err){
                // Error while creating a new user
                sendError(client, err);
            });
        }
    }).catch(function(err){
        // Error while finding existing user
        sendError(client, err);
    });

    // Set up event handlers for the socket
    client.on('data.persist', function(data:any){
        handler_modules.handleEvent('data.persist', data).then(function(events:EventWrapper[]){
            if(events !== null) events.forEach(function(event){
                try{
                    connections.sendEvent(event);
                }catch(err){
                    console.log(err);
                }
            });
        }).catch(function(err:any){
            // Something went wrong while persisting data
            sendError(client, err);
        });
    });
        

    client.on('data.get', function(data:any){
        handler_modules.handleEvent('data.get', data).then(function(events:EventWrapper[]){
            if(events !== null) events.forEach(function(event){
                try{
                    connections.sendEvent(event);
                }catch(err){
                    console.log(err);
                }
            });
        }).catch(function(err:any){
            // Something went wrong while getting data
            sendError(client, err);
        });
    });
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