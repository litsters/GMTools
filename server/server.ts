import express from "express";
import bodyParser from "body-parser";
import { AuthApi } from "./api";

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// API Registration
AuthApi(app);

// HTML Server
app.use('/', express.static(__dirname + '/public'));

// Start Server
app.listen(8080, function () {
    console.log(`Server is started on port ${process.env.PORT || 8080}`);
});