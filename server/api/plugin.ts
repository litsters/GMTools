import { Application, Request, Response } from 'express';
import loadPlugin from "../plugins";

export default function (app: Application) {
    app.route('/plugin/:name')
        .get(getPlugin);
}

function getPlugin(request: Request, response: Response) {
    const pluginName = request.param("name");
    
    loadPlugin(pluginName, (err: any, result: any) => {
        response.json(result);
    });
}