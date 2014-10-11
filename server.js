var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');

var appDirectory = path.join(__dirname, 'app');
app.use(express.static(appDirectory));
console.log('server using static ' + appDirectory);

var port = process.env.PORT || 3000;
app.listen(port);
console.log('server listening on port ' + port);

var dbPath = 'mongodb://localhost/panda-stats';
mongoose.connect(dbPath);
var db = mongoose.connection;
db.on('error', function(){
  console.error('error connecting to ' + dbPath);
});
db.on('open', function(){
  console.log('connected to ' + dbPath);
});