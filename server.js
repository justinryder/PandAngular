var express = require('express');
var path = require('path');
var mongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

var app = express();

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
    var cursor =  req.collection.find(getQueryOrEmptyObject(req));
    if (req.query.take){
      cursor = cursor.limit(+req.query.take);
    }
    cursor.toArray(function(e, results){
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
    req.collection.update(getQueryOrEmptyObject(req), req.body, { safe: true, multi: false }, function (e, results){
      if (e) return next(e);
      res.json(results);
    });
  });

  router.delete('/collections/:collectionName', function(req, res, next){
    console.log('DELETE ' + req.params.collectionName);
    req.collection.remove(getQueryOrEmptyObject(req), function(e, results){
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

function getQueryOrEmptyObject(req){
  return req.query.query ? JSON.parse(req.query.query) : {};
}