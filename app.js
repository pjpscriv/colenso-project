var express = require('express');           // App framework
var path = require('path');                 // Node thing for dealing with paths. E.g. adding in all the directories node uses
var favicon = require('serve-favicon');     // For fav-icon
var logger = require('morgan');             // A logging software. Useful for when dev-ing (if I knew how to use it)
var cookieParser = require('cookie-parser');// For dealing with cookies
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var browse = require('./routes/browse');
var search = require('./routes/search');
var view = require('./routes/view');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/browse', browse);
app.use('/search', search);
app.use('/view', view);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// Development error handler (will print stacktrace)
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;