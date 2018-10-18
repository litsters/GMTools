"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pluginsDir = path_1.default.resolve(__dirname + "/../") + "/plugins";
console.log("ryan test");
const loadPlugin = (pluginName) => {
    const path = `${pluginsDir}/${pluginName}`;
    var plugin = {};
    var files = [];
    fs_1.default.readdir(path, (err, file) => {
        fs_1.default.readFile(`${path}/${file}`, (err, data) => {
            plugin[file] = data;
            console.log("---------");
            console.log(data);
        });
    });
};
exports.default = loadPlugin;
//# sourceMappingURL=plugins.js.map