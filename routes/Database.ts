import * as express from 'express';
import { NextFunction } from 'express-serve-static-core';
// import Nano from "nano";

let config = { couch_admin: process.env.COUCH_ADMIN,
  couch_password: process.env.COUCH_PASSWORD,
  couch_host: process.env.COUCH_HOST,
  couch_port: process.env.COUCH_PORT
}

// let nano = Nano('http://localhost:5984')
//var nano = require('nano')('http://localhost:5984');
let nano = require('nano')("http://" + config.couch_admin + ":" + config.couch_password + "@" + config.couch_host + ':' + config.couch_port);

let router = express.Router();

router.get('/database', (req: any, res: any, next: any) => {
    res.render('database',{
        title: 'Express Database'
    });
});

router.post('/database', (req: any, res: any, next: any) => {
    // var nano = require('nano')("http://" + config.couch_admin + ":" + config.couch_password + "@" + config.couch_host + ':' + config.couch_port);
    // console.log(req);
    if ((req.body.params.username.length > 0) && (req.session)) {
        req.session.username = req.body.params.username;

        let troupeDbId = req.body.params.troupeDbId;
        let username = req.body.params.username;

        let secObj = {
            admins: {
                names: [username],
                roles: []
            },
            members: {
                names: [username],
                roles: []
            }
        };

        nano.db.create(troupeDbId, (err: any, body: any) => {
            if (err) {
                console.log('[db.create] ', err.message);
                //res.send(err);
                return;
            }
            else {
                console.log('database created!');
                let troupeDb = nano.use(troupeDbId);
                troupeDb.insert(secObj, "_security", (err: any, body: any) => {
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
    } else {
        //res.render('database', {
        //    title: 'Express',
        //    ErrorMessage: 'Please enter a user name'
        //});
        res.json({ message: 'Please enter a user name' });
    }
});

export {router};