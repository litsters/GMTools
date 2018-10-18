"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pluginsDir = path_1.default.resolve(__dirname + "/../") + "/plugins";
const fileExtensionRegex = /(?:\.([^.]+))?$/;
const loadPlugin = (pluginName, callback) => {
    const path = `${pluginsDir}/${pluginName}`;
    var plugin = {
        name: pluginName
    };
    let items = fs_1.default.readdirSync(path);
    items.forEach((item, idx) => {
        let objName = item.split('.')[0];
        let extension = fileExtensionRegex.exec(item)[1];
        if (extension === "json") {
            let buffer = fs_1.default.readFileSync(`${path}/${item}`);
            let data = buffer.toString();
            plugin[objName] = JSON.parse(data);
        }
    });
    callback(null, plugin);
};
exports.default = loadPlugin;
//# sourceMappingURL=plugins.js.map