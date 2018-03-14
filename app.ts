import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as path from 'path';

import * as Index from './routes/Index';
import * as Login from './routes/Login';
import * as Database from './routes/Database';
import * as Dialogue from './routes/Dialogue';

import * as dotenv from 'dotenv';

const result = dotenv.config()
if (result.error) {
  throw result.error
}

let app: any = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({ secret: 'asdf',     
                  resave: true,
                  saveUninitialized: true
                }));

app.use((req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT', 'POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', Index.router);
app.use('/', Login.router);
app.use('/', Database.router);
app.use('/', Dialogue.router);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));

app.listen(process.env.PORT, () => {
  console.log('server is running on port 3000');
});
