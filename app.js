var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors  = require('cors');
var expressLayouts = require('express-ejs-layouts');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(expressLayouts);



app.use('/', indexRouter);
app.use('/users', usersRouter);

/** testcode */
var session = require('express-session');


app.get('/hello/:id', function(req, res){
    console.log(req.params.id)
    res.send("<h1>Welcome to dashboard!</h1>");
});

/**  */


module.exports = app;
