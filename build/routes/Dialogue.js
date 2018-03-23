"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var SuperLogin = require('superlogin');
var dotenv = require("dotenv");
var result = dotenv.config();
if (result.error) {
    throw result.error;
}
var superloginConfig = require('../../superlogin.config.js');
var localAdmin = process.env.COUCH_ADMIN;
var localPassword = process.env.COUCH_PASSWORD;
superloginConfig.dbServer.user = localAdmin;
superloginConfig.dbServer.password = localPassword;
console.log(superloginConfig.dbServer.user);
console.log(superloginConfig.dbServer.password);
console.log(superloginConfig.dbServer.host);
var config = { couch_admin: process.env.COUCH_ADMIN,
    couch_password: process.env.COUCH_PASSWORD,
    couch_host: process.env.COUCH_HOST,
    couch_port: process.env.COUCH_PORT
};
var nano = require('nano')("http://" + config.couch_admin + ":" + config.couch_password + "@" + config.couch_host + ':' + config.couch_port);
var router = express.Router();
exports.router = router;
// Initialize SuperLogin
var superlogin = new SuperLogin(superloginConfig);
router.get('/dialogue', function (req, res, next) {
    res.render('dialogue', {
        title: 'Express Dialogue'
    });
});
router.post('/dialogue', function (req, res, next) {
    console.log(req.body.params.dialogueId.length);
    if (req.body.params.dialogueId.length > 0) {
        var dialogueId_1 = req.body.params.dialogueId;
        var username1 = req.body.params.username1;
        var username2 = req.body.params.username2;
        var secObj_1 = {
            admins: {
                names: ['admin', username1, username2],
                roles: []
            },
            members: {
                names: ['admin'],
                roles: []
            }
        };
        console.log('about to create dialogue database');
        nano.db.create(dialogueId_1, function (err, body) {
            if (err) {
                console.log('[db.create] ', err.message);
                return;
            }
            else {
                console.log('dialogue database created!');
                var dialogueDb = nano.use(dialogueId_1);
                dialogueDb.insert(secObj_1, "_security", function (err, body) {
                    if (err) {
                        console.log('[_security.insert] ', err.message);
                        return;
                    }
                    console.log('[_security.insert] : Security profile setup!');
                });
            }
        });
        res.json({ message: 'dialogue database created!' });
        console.log('about to add users to database');
        superlogin.addUserDB(username1, dialogueId_1, 'shared');
        superlogin.addUserDB(username2, dialogueId_1, 'shared');
    }
    else {
        res.json({ message: 'Please enter a user names' });
    }
});
