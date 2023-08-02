var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var mysql = require('mysql');
var dbConnectionPool = mysql.createPool({ host: 'localhost', database: 'my_system' });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next){
  req.pool = dbConnectionPool;
  next();
});

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'super secret string of my choice',
  secure: false
}));

//this is used to log the logins
app.use(function(req, res, next){
  console.log("The current user is: " + req.session.username);
  next();
});


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.get('/cookie', (req, res) => {
    const cookieValue = req.cookies.task3_1;
    if (!cookieValue) {
      res.cookie('task3_1', 1);
    } else {
      res.cookie('task3_1', parseInt(cookieValue, 10) + 1);
    }
    res.sendStatus(200);
  });


let requestCount = 0;
app.use((req, res, next) => {
  requestCount++;
  console.log(`Received ${requestCount} requests`);
  next();
});


app.get('/time', (req, res) => {
  res.send(new Date());
});


module.exports = app;