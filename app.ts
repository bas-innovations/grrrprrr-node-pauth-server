import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as path from 'path';
import * as http from 'http';
import * as cors from 'cors';
import * as logger from 'morgan';
var SuperLogin = require('superlogin');

import * as Index from './routes/Index';
import * as Login from './routes/Login';
import * as Database from './routes/Database';
import * as Dialogue from './routes/Dialogue';

import * as dotenv from 'dotenv';
const result = dotenv.config()
if (result.error) {
  throw result.error
}

var superloginConfig = require('./superlogin.config.js');

console.log(process.env.COUCH_ADMIN);
console.log(process.env.COUCH_PASSWORD);
console.log(process.env.COUCH_HOST);
console.log(process.env.COUCH_PORT);

let localAdmin: string = process.env.COUCH_ADMIN as string;
let localPassword: string = process.env.COUCH_PASSWORD as string;
let host: string = process.env.COUCH_HOST + ':' + process.env.COUCH_PORT;
superloginConfig.dbServer.host = host;
superloginConfig.dbServer.user = localAdmin;
superloginConfig.dbServer.password = localPassword;
console.log(superloginConfig.dbServer.user);
console.log(superloginConfig.dbServer.password);
console.log(superloginConfig.dbServer.host);

let app: any = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use((req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT', 'POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Initialize SuperLogin
var superlogin = new SuperLogin(superloginConfig);
 
// Mount SuperLogin's routes to our app
app.use('/auth', superlogin.router);

app.use('/', Index.router);
app.use('/', Login.router);
app.use('/', Database.router);
app.use('/', Dialogue.router);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));

app.listen(process.env.PORT, () => {
  console.log('server is running on port 3000');
});
