"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const plugins_1 = __importDefault(require("../plugins"));
function default_1(app) {
    app.route('/plugin/:name')
        .get(getPlugin);
    app.route('/plugin/:name/stylesheet')
        .get(getStylesheet);
}
exports.default = default_1;
function getPlugin(request, response) {
    const pluginName = request.param("name");
    plugins_1.default(pluginName, (err, result) => {
        response.json(result);
    });
}
// Convert to generalized function for getting any static file in plugin directory
function getStylesheet(request, response) {
    const pluginName = request.param("name");
    const pluginTheme = `../plugins/${pluginName}/theme.css`;
    response.writeHead(200, { 'Content-type': 'text/css' });
    var fileContents = fs_1.default.readFileSync(pluginTheme, { encoding: 'utf8' });
    response.write(fileContents);
    response.end();
}
//# sourceMappingURL=plugin.js.map