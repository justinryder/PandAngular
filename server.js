var express = require('express');
var path = require('path');
var mongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

var app = express();

//app.use(bodyParser.urlencoded({ extend: true }));
//app.use(bodyParser.json());

var router = express.Router();

var appDirectory = path.join(__dirname, 'app');
app.use(express.static(appDirectory));
console.log('server using static ' + appDirectory);

var port = process.env.PORT || 3000;
app.listen(port);
console.log('server listening on port ' + port);

var dbUser = 'stinkypanda';
var dbPassword = 'peeyou';
var dbPath = 'mongodb://' + dbUser + ':' + dbPassword + '@ds041380.mongolab.com:41380/panda-stats';

mongoClient.connect(dbPath, function(err, db){
  router.use(function(req, res, next){
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    next();
  });

  router.use(bodyParser.urlencoded({ extend: true }));
  router.use(bodyParser.json());

  router.param('collectionName', function(req, res, next, collectionName){
    req.collection = db.collection(collectionName);
    return next();
  });

  router.get('/collections/:collectionName', function(req, res, next){
    console.log('GET ' + req.params.collectionName);
    req.collection.find({}).toArray(function(e, results){
      if (e) return next(e);
      res.json(results);
    });
  });

  router.get('/collections/:collectionName/:field/:value', function(req, res, next){
    console.log('GET ' + req.params.collectionName + '.' + req.params.field + ' == ' + req.params.value);
    var query = {};
    query[req.params.field] = req.params.value;
    req.collection.find(query).toArray(function(e, results){
      if (e) return next(e);
      res.json(results);
    });
  });

  router.post('/collections/:collectionName', function(req, res, next){
    console.log('POST ' + req.params.collectionName);
    req.collection.insert(req.body, {}, function(e, results){
      if (e) return next(e);
      res.json(results);
    });
  });

  router.put('/collections/:collectionName', function(req, res, next){
    console.log('PUT ' + req.params.collectionName);
    req.collection.update(req.body.query, req.body.update, { safe: true, multi: false }, function (e, results){
      if (e) return next(e);
      res.json(results);
    });
  });

  router.delete('/collections/:collectionName/:id', function(req, res, next){
    console.log('DELETE ' + req.params.collectionName + ' ' + req.params.id);
    req.collection.remove({ _id: req.collection.id(req.params.id) }, function(e, results){
      if (e) return next(e);
      res.json(results);
    });
  });

  app.use('/api', router);

  function cleanup(){
    console.log('close command received. disconnecting from db...');
    db.close();
    process.exit(0);
  }

  process.on('SIGINT', cleanup).on('SIGTERM', cleanup);
});