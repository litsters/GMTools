import { Application, Request, Response } from 'express';
import fs from "fs";
import { loadPlugin, loadPluginNames } from "../plugins";


export default function (app: Application) {
    app.route('/plugin/:name')
        .get(getPlugin);

    app.route('/plugins/names')
        .get(getPluginNames);
}

function getPlugin(request: Request, response: Response) {
    const pluginName = request.param("name");

    loadPlugin(pluginName, (err: any, result: any) => {
        response.json(result);
    });
}

function getPluginNames(request:Request, response:Response) {
    loadPluginNames((result:any) => {
        response.json(result);
    });
}