var express = require('express');
var app = express();
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('./config/db');
var products = require('./apis/product')(router);
var auth = require('./apis/auth')(router);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, authorization, Accept");
	 	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.all('/', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use('/products', products);
app.use('/authentication', auth);

var port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log("Listening to port " + port);
});
