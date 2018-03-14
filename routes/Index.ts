import * as express from 'express';
let router = express.Router();

router.get('/', (req: any, res: any, next: any) => {
    let renderData = { title: 'Express', username: ''}
    if (req.session) {
        renderData.username = req.session.username;
    }
    res.render('index', renderData);
});

export { router };