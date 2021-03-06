let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let mongoose = require('mongoose');
let config_db = require('./configs/mongodb');
let io = require('./apps/sockets/home_socket');


let indexRouter = require('./apps/routes/index');
let usersRouter = require('./apps/routes/users');
let loginRouter = require('./apps/routes/login');
let logoutRouter = require('./apps/routes/logout');
let signupRouter = require('./apps/routes/signup');
let userAPIRouter = require('./apps/routes/api/userAPI');
let groupAPIRouter = require('./apps/routes/api/groupAPI');


let app = express();
app.io = io;

mongoose.connect(`mongodb+srv://${config_db.user}:${config_db.password}@cluster0-cg8vd.mongodb.net/${config_db.db_name}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
require('./apps/models/group_model');
require('./apps/models/user_model');
require('./apps/models/detail_convese_model');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected to Mongoose Cloud");
});


// view engine setup
app.set('views', path.join(__dirname, 'apps', 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', setupConnection);
app.use(logger('dev'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sign-in', loginRouter);
app.use('/sign-out', logoutRouter);
app.use('/sign-up', signupRouter);
app.use('/api/user', userAPIRouter);
app.use('/api/group', groupAPIRouter(io));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 404);
  res.json({
    error: true,
    message: "The page you are looking for does not exist",
    error_code: "page-not-exist"
  });
  // console.error(err);
  console.error('Error: ' + req.path);
});

module.exports = app;
