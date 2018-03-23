"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var dotenv = require("dotenv");
var result = dotenv.config();
if (result.error) {
    throw result.error;
}
var config = { couch_admin: process.env.COUCH_ADMIN,
    couch_password: process.env.COUCH_PASSWORD,
    couch_host: process.env.COUCH_HOST,
    couch_port: process.env.COUCH_PORT
};
// let nano = Nano('http://localhost:5984')
//var nano = require('nano')('http://localhost:5984');
var connectionString = "http://" + config.couch_admin + ":" + config.couch_password + "@" + config.couch_host + ':' + config.couch_port;
console.log(connectionString);
var nano = require('nano')(connectionString);
var router = express.Router();
exports.router = router;
router.get('/database', function (req, res, next) {
    res.render('database', {
        title: 'Express Database'
    });
});
router.post('/database', function (req, res, next) {
    // var nano = require('nano')("http://" + config.couch_admin + ":" + config.couch_password + "@" + config.couch_host + ':' + config.couch_port);
    console.log(req);
    if ((req.body.params.username.length > 0) && (req.session)) {
        req.session.username = req.body.params.username;
        var troupeDbId_1 = req.body.params.troupeDbId;
        var username = req.body.params.username;
        var secObj_1 = {
            admins: {
                names: [username],
                roles: []
            },
            members: {
                names: [username],
                roles: []
            }
        };
        nano.db.create(troupeDbId_1, function (err, body) {
            if (err) {
                console.log('[db.create] ', err.message);
                //res.send(err);
                return;
            }
            else {
                console.log('database created!');
                var troupeDb = nano.use(troupeDbId_1);
                troupeDb.insert(secObj_1, "_security", function (err, body) {
                    if (err) {
                        console.log('[_security.insert] ', err.message);
                        //res.send(err);
                        return;
                    }
                    console.log('[_security.insert] : Security profile setup!');
                });
            }
        });
        res.json({ message: 'database created!' });
        // res.redirect('/');
    }
    else {
        //res.render('database', {
        //    title: 'Express',
        //    ErrorMessage: 'Please enter a user name'
        //});
        res.json({ message: 'Please enter a user name' });
    }
});
