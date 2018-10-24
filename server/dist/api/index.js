"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
const plugin_1 = __importDefault(require("./plugin"));
const user_1 = __importDefault(require("./user"));
exports.registerAPIs = (app) => {
    auth_1.default(app);
    plugin_1.default(app);
    user_1.default(app);
};
//# sourceMappingURL=index.js.map