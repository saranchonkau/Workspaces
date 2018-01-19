// modules =================================================
const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const mongoose = require("mongoose");
const app = express();

// connect to our mongoDB database
mongoose.connect("mongodb://localhost/users", {
    useMongoClient: true
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// set the static files location /public/img will be /img for users
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());

// ==== Authentication ====
require('./authentication/strategies')(passport);
app.use(session({ secret: 'HomeTask2' }));
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/', require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.error(req.headers);
    let err = new Error('Not Found');
    err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('blocked');
    console.error(err.stack);
});

module.exports = app;
