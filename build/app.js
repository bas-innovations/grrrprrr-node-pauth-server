"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var cors = require("cors");
var logger = require("morgan");
var SuperLogin = require('superlogin');
var Index = require("./routes/Index");
var Login = require("./routes/Login");
var Database = require("./routes/Database");
var Dialogue = require("./routes/Dialogue");
var Troupe = require("./routes/Troupe");
var dotenv = require("dotenv");
var result = dotenv.config();
if (result.error) {
    throw result.error;
}
var superloginConfig = require('./superlogin.config.js');
console.log(process.env.COUCH_ADMIN);
console.log(process.env.COUCH_PASSWORD);
console.log(process.env.COUCH_HOST);
console.log(process.env.COUCH_PORT);
var localAdmin = process.env.COUCH_ADMIN;
var localPassword = process.env.COUCH_PASSWORD;
var host = process.env.COUCH_HOST + ':' + process.env.COUCH_PORT;
superloginConfig.dbServer.host = host;
superloginConfig.dbServer.user = localAdmin;
superloginConfig.dbServer.password = localPassword;
console.log(superloginConfig.dbServer.user);
console.log(superloginConfig.dbServer.password);
console.log(superloginConfig.dbServer.host);
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT', 'POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Initialize SuperLogin
var superlogin = new SuperLogin(superloginConfig);
// Mount SuperLogin's routes to our app
app.use('/auth', superlogin.router);
app.use('/', Index.router);
app.use('/', Login.router);
app.use('/', Database.router);
app.use('/', Dialogue.router);
app.use('/', Troupe.router);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));
app.listen(process.env.PORT, function () {
    console.log('server is running on port 3000');
});
