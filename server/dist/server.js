"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const socketio_auth_1 = __importDefault(require("socketio-auth"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const connections_1 = __importDefault(require("./connections"));
const clientconnection_1 = __importDefault(require("./clientconnection"));
const api_1 = require("./api");
const port = 8080;
const key = 'gm-tools.pem';
const iss = 'https://gm-tools.auth0.com/'; // This is the issuer's domain
const aud = '5j5hV3sMFUstdIOijBgVxGWuSw059kBQ'; // This is the client ID for auth0
// Set up the connection tracker
const connections = new connections_1.default();
const __serverDir = __dirname + (path_1.default.basename(__dirname) === "dist" ? "/../" : "");
const __publicDir = path_1.default.join(__serverDir, "/dist/public");
const models_1 = __importDefault(require("./db/models"));
const plugins_1 = __importDefault(require("./plugins"));
models_1.default.User.count({})
    .then((count) => console.log(`Found ${count} characters`));
var dnd5ePlugin = {};
plugins_1.default("dnd-5e", (err, result) => {
    dnd5ePlugin = result; //{...dnd5ePlugin, ...result};
});
const app = express_1.default();
// Middleware
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// API Registration
api_1.AuthApi(app);
api_1.PluginApi(app);
// HTML Server
app.use('/static', express_1.default.static(path_1.default.join(__publicDir, "/static")));
app.use('/plugins', express_1.default.static(path_1.default.join(__serverDir, "/plugins")));
app.get('/*', (request, response) => {
    response.sendFile(path_1.default.join(__publicDir, "/index.html"));
});
// Socket server
const server = require('http').createServer(app);
const io = require('socket.io')(server);
// Authentication function
const authenticate = (client, data, callback) => __awaiter(this, void 0, void 0, function* () {
    // validate credentials
    // Verify that token hasn't expired
    if (!data.expires_at)
        return callback(new Error("Invalid credentials"));
    else if (data.expires_at < new Date().getTime()) {
        return callback(new Error("Invalid credentials"));
    }
    // Verify that access token is valid
    if (!data.id_token)
        return callback(new Error("Invalid credentials"));
    else {
        try {
            let options = {
                algorithms: ['RS256'],
                issuer: iss,
                audience: aud
            };
            let cert = fs_1.default.readFileSync(key);
            let decoded = jsonwebtoken_1.default.verify(data.id_token, cert, options);
            // Cast decoded to a Token to make it easier to work with
            let token = decoded;
            // Add authenticated socket to connections
            let connection = new clientconnection_1.default(token["https://gm-tools.com/user_id"], token["https://gm-tools.com/nickname"], client);
            connections.addConnection(connection);
            // connections.print();
        }
        catch (err) {
            console.log(JSON.stringify(err, null, 2));
            return callback(new Error("Invalid credentials"));
        }
    }
    return callback(null, true);
});
// Register handlers
const postAuthenticate = (client) => {
    // Get user information
    let socketid = client.id;
    let connection = connections.getConnection(socketid);
    let userid = connection.getId();
    models_1.default.User.findOne({ id: userid }).then(function (user) {
        if (user !== null) {
            // If user is not null, send it to client
            // console.log("user data retrieved!");
            // console.log(JSON.stringify(user,null,2));
            let event = {
                namespace: "user",
                key: "current-data",
                data: user
            };
            client.emit('data.retrieved', event);
        }
        else {
            // Else, create new user and sent to client
            // console.log("no user data available");
            let nickname = connection.getNickname();
            models_1.default.User.create({ id: userid, nickname: nickname }).then(function (user) {
                // console.log("successful create: " + JSON.stringify(user,null,2));
                let event = {
                    namespace: "user",
                    key: "current-data",
                    data: user
                };
                client.emit('data.retrieved', event);
            }).catch(function (err) {
                // Error while creating a new user
                console.log("err while creating: " + err);
                let event = {
                    error: "An error occurred while loading your user information.",
                    details: {
                        mongomsg: err
                    }
                };
                client.emit('app.error', event);
            });
        }
    }).catch(function (err) {
        // Error while finding existing user
        let event = {
            error: "An error occurred while loading your user information.",
            details: {
                mongomsg: err
            }
        };
        client.emit('app.error', event);
    });
    client.on('greeting', function (data) {
        console.log(JSON.stringify(data, null, 2));
    });
};
// Clean up function
const disconnect = (client) => {
    // remove socket from connection list
    connections.removeConnection(client.id);
    // connections.print();
};
// Configure authentication
socketio_auth_1.default(io, { authenticate, postAuthenticate, disconnect, timeout: "none" });
// Start Server
server.listen(port, function () {
    console.log(`Server is started on port ${process.env.PORT || port}`);
});
//# sourceMappingURL=server.js.map