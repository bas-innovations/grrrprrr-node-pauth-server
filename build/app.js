"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var path = require("path");
var Index = require("./routes/Index");
var Login = require("./routes/Login");
var Database = require("./routes/Database");
var Dialogue = require("./routes/Dialogue");
var dotenv = require("dotenv");
var result = dotenv.config();
if (result.error) {
    throw result.error;
}
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'asdf',
    resave: true,
    saveUninitialized: true
}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT', 'POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/', Index.router);
app.use('/', Login.router);
app.use('/', Database.router);
app.use('/', Dialogue.router);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));
app.listen(process.env.PORT, function () {
    console.log('server is running on port 3000');
});
