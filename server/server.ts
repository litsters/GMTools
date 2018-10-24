import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { AuthApi, PluginApi } from "./api";

import loadPlugin from "./plugins";

var dnd5ePlugin = {};
loadPlugin("dnd-5e", (err: any, result: any) => {
    dnd5ePlugin = result;//{...dnd5ePlugin, ...result};
});

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// API Registration
AuthApi(app);
PluginApi(app);

// HTML Server
app.use('/', express.static(__dirname + '/public'));

// Start Server
app.listen(8080, function () {
    console.log(`Server is started on port ${process.env.PORT || 8080}`);
});