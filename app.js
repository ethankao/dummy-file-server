
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express();

// all environments
app.set('port', 5566);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function uploadFile(req, res) {
  var paths = [];
  var publicRoot = __dirname + '/public';
  var serverFolderPath = '/files/' + req.params.id + '/';
  if (!fs.existsSync(publicRoot + serverFolderPath)) {
    fs.mkdirSync(publicRoot + serverFolderPath);
  }

  for (var file in req.files) {
    var filePath = publicRoot + serverFolderPath + file;
    fs.renameSync(req.files[file].path, filePath);
    paths.push(serverFolderPath + file);
  }

  res.send(paths);
}

// routes
app.get('/', routes.index);

app.post('/upload/:id', uploadFile);
