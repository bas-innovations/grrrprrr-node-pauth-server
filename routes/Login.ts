import * as express from 'express';
import { NextFunction } from 'express-serve-static-core';
let router = express.Router();

router.get('/login', (req: any, res: any, next: any) => {
    res.render('login',{
        title: 'Express Login'
    });
});

router.post('/login', (req: any, res: any, next: any) => {
    if ((req.body.username.length > 0) && (req.session)) {
            req.session.username = req.body.username;
        res.send(`Login module processed ${req.url} with username: ${req.body.username} and password: ${req.body.password}\n`);
        res.redirect('/');
    } else {
        res.render('login', {
            title: 'Express',
            ErrorMessage: 'Please enter a user name'
        });
    }
});

export {router};