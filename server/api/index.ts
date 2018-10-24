import { Application } from 'express';
import AuthApi from "./auth";
import PluginApi from "./plugin";
import UserApi from "./user";

export const registerAPIs = (app:Application) => {
    AuthApi(app);
    PluginApi(app);
    UserApi(app);
}