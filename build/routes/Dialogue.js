"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var config = { couch_admin: process.env.COUCH_ADMIN,
    couch_password: process.env.COUCH_PASSWORD,
    couch_host: process.env.COUCH_HOST,
    couch_port: process.env.COUCH_PORT
};
var nano = require('nano')("http://" + config.couch_admin + ":" + config.couch_password + "@" + config.couch_host + ':' + config.couch_port);
var router = express.Router();
exports.router = router;
router.get('/dialogue', function (req, res, next) {
    res.render('dialogue', {
        title: 'Express Dialogue'
    });
});
router.post('/dialogue', function (req, res, next) {
    if ((req.body.params.username.length > 0) && (req.session)) {
        req.session.username = req.body.params.username1;
        var dialogueId_1 = req.body.params.dialogueId;
        var username1 = req.body.params.username1;
        var username2 = req.body.params.username2;
        var secObj_1 = {
            admins: {
                names: [username1, username2],
                roles: []
            },
            members: {
                names: [username1, username2],
                roles: []
            }
        };
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
    }
    else {
        res.json({ message: 'Please enter a user names' });
    }
});
