"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugins_1 = __importDefault(require("../plugins"));
function default_1(app) {
    app.route('/plugin/:name')
        .get(getPlugin);
}
exports.default = default_1;
function getPlugin(request, response) {
    const pluginName = request.param("name");
    plugins_1.default(pluginName, (err, result) => {
        response.json(result);
    });
}
//# sourceMappingURL=plugin.js.map