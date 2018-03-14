"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
exports.router = router;
router.get('/login', function (req, res, next) {
    res.render('login', {
        title: 'Express Login'
    });
});
router.post('/login', function (req, res, next) {
    if ((req.body.username.length > 0) && (req.session)) {
        req.session.username = req.body.username;
        res.send("Login module processed " + req.url + " with username: " + req.body.username + " and password: " + req.body.password + "\n");
        res.redirect('/');
    }
    else {
        res.render('login', {
            title: 'Express',
            ErrorMessage: 'Please enter a user name'
        });
    }
});
