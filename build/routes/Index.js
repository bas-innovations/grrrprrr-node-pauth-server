"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
exports.router = router;
router.get('/', function (req, res, next) {
    var renderData = { title: 'Express', username: '' };
    if (req.session) {
        renderData.username = req.session.username;
    }
    res.render('index', renderData);
});
