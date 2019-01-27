const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


const index = require('./routes/index');
const users = require('./routes/users');
const articles = require('./routes/articles');
const admin = require('./routes/admin');
const configDB = require('./config/db');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

mongoose.connect(configDB.url);
require('./config/passport');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 180 * 60 * 1000}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



app.use('/', index);
app.use('/users', users);
app.use('/articles', articles);
app.use('/admin', admin);

app.use(function(req, res, next){
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'production' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('Index/error');
});

module.exports = app;
