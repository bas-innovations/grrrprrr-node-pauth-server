import * as express from 'express';
import { NextFunction } from 'express-serve-static-core';
let SuperLogin = require('superlogin');

import * as dotenv from 'dotenv';
const result = dotenv.config()
if (result.error) {
  throw result.error
}

var superloginConfig = require('../../superlogin.config.js');

let localAdmin: string = process.env.COUCH_ADMIN as string;
let localPassword: string = process.env.COUCH_PASSWORD as string;
superloginConfig.dbServer.user = localAdmin;
superloginConfig.dbServer.password = localPassword;
console.log(superloginConfig.dbServer.user);
console.log(superloginConfig.dbServer.password);
console.log(superloginConfig.dbServer.host);

let config = { couch_admin: process.env.COUCH_ADMIN,
               couch_password: process.env.COUCH_PASSWORD,
               couch_host: process.env.COUCH_HOST,
               couch_port: process.env.COUCH_PORT
            }

let nano = require('nano')("http://" + config.couch_admin + ":" + config.couch_password + "@" + config.couch_host + ':' + config.couch_port);

let router = express.Router();
// Initialize SuperLogin
let superlogin = new SuperLogin(superloginConfig);

router.get('/troupe', (req: any, res: any, next: any) => {
    res.render('troupe',{
        title: 'Express Dialogue'
    });
});

router.post('/troupe', (req: any, res: any, next: any) => {
  console.log(req.body.params.troupeUid.length);

  if (req.body.params.troupeUid.length > 0) {
      
      let troupeUid = req.body.params.troupeUid;
      let username = req.body.params.username;

      let secObj = {
          admins: {
              names: ['admin', username],
              roles: []
          },
          members: {
              names: ['admin'],
              roles: []
          }
      };
      console.log('about to create troupe database');
      nano.db.create(troupeUid, (err: any, body: any) => {
          if (err) {
              console.log('[db.create] ', err.message);
              return;
          }
          else {
              console.log('dialogue database created!');
              let troupeDb = nano.use(troupeUid);
              troupeDb.insert(secObj, "_security", (err: any, body: any) => {
                  if (err) {
                      console.log('[_security.insert] ', err.message);
                      return;
                  }
                  console.log('[_security.insert] : Security profile setup!')
              });
          }
      });
      res.json({ message: 'troupe database created!' });
      console.log('about to add users to database');
      superlogin.addUserDB(username, troupeUid, 'shared');

  } else {
      res.json({ message: 'Please enter a username and troupeUid for troupe database' });
  }
});

router.post('/troupe/addmember', (req: any, res: any, next: any) => {
  console.log(req.body.params.troupeUid.length);

  if (req.body.params.troupeUid.length > 0) {
    let troupeUid = req.body.params.troupeUid;
    let username = req.body.params.username;
    superlogin.addUserDB(username, troupeUid, 'shared');
  } else {
      res.json({ message: 'Please enter a username and troupeUid' });
  }
});

export {router};