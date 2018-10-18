import fs from "fs";
import path from "path";

const pluginsDir = path.resolve(__dirname + "/../") + "/plugins";

const loadPlugin = (pluginName: string) => {
    const path = `${pluginsDir}/${pluginName}`;
    var plugin: any = {};
    var files: Array<any> = [];
    
    fs.readdir(path, (err: any, file: any) => {
        fs.readFile(`${path}/${file}`, (err: any, data: any) => {
            plugin[file] = data;

            console.log("---------")
            console.log(data);
        });
    });
}

export default loadPlugin;