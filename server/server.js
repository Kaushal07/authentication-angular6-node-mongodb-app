'use strict';

const express = require("express");
const http = require('http');
const socketio = require('socket.io');
require('./config/db');

const socketEvents = require('./web/socket');
const mainModules = require('./modules');
const appConfig = require('./config/app-config');

global.ROOT_PATH = __dirname;
global.__lodash = require('lodash');

const multer =require('multer');
//multer image store
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('file : ', file);
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    let splitFileName = file.originalname.split('.');
    file.originalname  = `${Math.random().toString(36).substring(2)}.${splitFileName[splitFileName.length-1]}`;
    cb(null, file.originalname);
  }
});

global.upload = multer({ storage: storage }).array('file', 1);
global.moreImagesUpload = multer({ storage: storage }).array('uploads[]', 12);

class Server{
  constructor(){
    this.app = express();
    this.http = http.Server(this.app);
    this.socket = socketio(this.http);
  }

  appConfig(){
    new appConfig(this.app).includeConfig();
  }

  /* Including app Routes starts*/
  includeRoutes(){
    new mainModules(this.app).initAPIs();
    new socketEvents(this.socket).socketConfig();
  }
  /* Including app Routes ends*/

  appExecute(){
    this.appConfig();
    this.includeRoutes();

    const port =  process.env.PORT || 5000;
    const host = process.env.HOST || `localhost`;

    this.http.listen(port, host, () => {
      console.log(`Listening on http://${host}:${port}`);
    });
  }
}

const app = new Server();
app.appExecute();

