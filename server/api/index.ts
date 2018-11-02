import { Application } from "express";
import AuthApi from "./auth";
import PluginApi from "./plugin";

const registerAPIs = (app:Application) => {
    AuthApi(app);
    PluginApi(app);
}

export default registerAPIs;