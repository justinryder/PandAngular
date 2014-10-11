var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extend: true }));
app.use(bodyParser.json());

var appDirectory = path.join(__dirname, 'app');
app.use(express.static(appDirectory));
console.log('server using static ' + appDirectory);

var port = process.env.PORT || 3000;
app.listen(port);
console.log('server listening on port ' + port);

var dbUser = 'stinkypanda';
var dbPassword = 'peeyou';
var dbPath = 'mongodb://ds041380.mongolab.com:41380/panda-stats';
mongoose.connect(dbPath, {
  user: dbUser,
  pass: dbPassword
});
var db = mongoose.connection;
db.on('error', function(){
  console.error('error connecting to ' + dbPath);
});
db.on('open', function(){
  console.log('connected to ' + dbPath);

  router.param('collectionName', function(req, res, next, collectionName){
    req.collection = db.collection(collectionName);
    return next();
  });

  router.get('/collections/:collectionName', function(req, res, next){
    console.log('GET ' + req.collectionName);
    req.collection.find({}).toArray(function(e, results){
      if (e) return next(e);
      res.json(results);
    });
  });

  router.post('/collections/:collectionName', function(req, res, next){
    req.collection.insert(req.body, {}, function(e, results){
      if (e) return next(e);
      res.json(results);
    });
  });

  app.use('/api', router);
});

function cleanup(){
  console.log('close command received. disconnecting from db...');
  mongoose.connection.close(function(){
    console.log('db connection has been closed. exiting...');
    process.exit(0);
  });
}

process.on('SIGINT', cleanup).on('SIGTERM', cleanup);