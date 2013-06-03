/*
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var models = require('./models');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var app = express();

// All environments.
app.set('port', process.env.PORT || 8048);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// For Heroku, use `heroku addons:add mongolab`
mongoose.connect(process.env.MONGOLAB_URI ||
                 process.env.MONGOHQ_URL || 
                 'mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', models.initialize);

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
