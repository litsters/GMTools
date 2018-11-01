import express, { Application } from "express";
import fs from "fs";
import path from "path";
import ICallback from "./interfaces/ICallback";

const serverDir = __dirname + (path.basename(__dirname) === "dist" ? "/../" : "");
const pluginsDir = path.resolve(serverDir) + "/plugins";
const fileExtensionRegex = /(?:\.([^.]+))?$/;

/*
    'loadPlugin()' synchronously creates a plugin object from the `~/server/plugins' directory
    with the specified plugin name. It does so synchronously in order to ensure that the object
    is fully populated before it can be used.

    It scans the plugin's directory for json files that is stores as properties of the plugin 
    object.ß
*/
export const loadPlugin = (pluginName: string, callback: ICallback) => {
    const path = `${pluginsDir}/${pluginName}`;
    let plugin: any = {}, 
        items = fs.readdirSync(path);

    items.forEach((item: string, idx: number) => {
        let objName = item.split('.')[0];
        let extension = fileExtensionRegex.exec(item)[1];
        
        if (extension === "json") {
            let buffer = fs.readFileSync(`${path}/${item}`); 
            let data = buffer.toString();

            plugin[objName] = JSON.parse(data);
        }
    });

    callback(null, plugin);
}

export const registerPluginAssetServer = (app:Application) => {
    app.use('/plugins', express.static(path.join(serverDir, "/plugins"), {index:false, extensions: ['png', 'svg', 'jpg']}));
}
