import * as express from 'express';
import { NextFunction } from 'express-serve-static-core';

let config = { couch_admin: process.env.COUCH_ADMIN,
               couch_password: process.env.COUCH_PASSWORD,
               couch_host: process.env.COUCH_HOST,
               couch_port: process.env.COUCH_PORT
            }

let nano = require('nano')("http://" + config.couch_admin + ":" + config.couch_password + "@" + config.couch_host + ':' + config.couch_port);

let router = express.Router();

router.get('/dialogue', (req: any, res: any, next: any) => {
    res.render('dialogue',{
        title: 'Express Dialogue'
    });
});

router.post('/dialogue', (req: any, res: any, next: any) => {

  if ((req.body.params.username.length > 0) && (req.session)) {
      req.session.username = req.body.params.username1;

      let dialogueId = req.body.params.dialogueId;
      let username1 = req.body.params.username1;
      let username2 = req.body.params.username2;

      let secObj = {
          admins: {
              names: [username1, username2],
              roles: []
          },
          members: {
              names: [username1, username2],
              roles: []
          }
      };

      nano.db.create(dialogueId, (err: any, body: any) => {
          if (err) {
              console.log('[db.create] ', err.message);
              return;
          }
          else {
              console.log('dialogue database created!');
              let dialogueDb = nano.use(dialogueId);
              dialogueDb.insert(secObj, "_security", (err: any, body: any) => {
                  if (err) {
                      console.log('[_security.insert] ', err.message);
                      return;
                  }
                  console.log('[_security.insert] : Security profile setup!')
              });
          }
      });
      res.json({ message: 'dialogue database created!' });

  } else {
      res.json({ message: 'Please enter a user names' });
  }
});

export {router};