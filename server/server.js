import express from "express";
const bodyParser = require("body-parser");
import { AuthApi } from "./api";


const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// API Registration
AuthApi(app);

// Start Server
app.listen(8080, function () {
    console.log('Server is started');
});