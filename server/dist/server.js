"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const api_1 = require("./api");
const plugins_1 = __importDefault(require("./plugins"));
var dnd5ePlugin = {};
plugins_1.default("dnd-5e", (err, result) => {
    dnd5ePlugin = result; //{...dnd5ePlugin, ...result};
});
const app = express_1.default();
// Middleware
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// API Registration
api_1.AuthApi(app);
// HTML Server
app.use('/', express_1.default.static(__dirname + '/public'));
// Start Server
app.listen(8080, function () {
    console.log(`Server is started on port ${process.env.PORT || 8080}`);
});
//# sourceMappingURL=server.js.map