import { Application, Request, Response } from 'express';
import fs from "fs";
import loadPlugin from "../plugins";


export default function (app: Application) {
    app.route('/plugin/:name')
        .get(getPlugin);

    app.route('/plugin/:name/stylesheet')
        .get(getStylesheet);
}

function getPlugin(request: Request, response: Response) {
    const pluginName = request.param("name");

    loadPlugin(pluginName, (err: any, result: any) => {
        response.json(result);
    });
}

// Convert to generalized function for getting any static file in plugin directory
function getStylesheet(request: Request, response: Response) {
    const pluginName = request.param("name");
    const pluginTheme = `../plugins/${pluginName}/theme.css`;

    response.writeHead(200, {'Content-type' : 'text/css'});
    var fileContents = fs.readFileSync(pluginTheme, {encoding: 'utf8'});
    response.write(fileContents);
    response.end();
}