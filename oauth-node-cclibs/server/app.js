const createError = require('http-errors');
const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes');

const key = fs.readFileSync(path.join(__dirname,'../localhost-key.pem'))
const cert = fs.readFileSync(path.join(__dirname, '../localhost.pem'))
const port = '3000';
const hostname = 'localhost';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));


app.use(session({
    secret: 'trythis',
    resave: false,
    saveUninitialized: true,
}));

/* Set up a HTTS server with the signed certification */
var httpsServer = https.createServer({
	key: fs.readFileSync(path.join(__dirname,'../localhost-key.pem')),
	cert: fs.readFileSync(path.join(__dirname, '../localhost.pem'))
}, app).listen(port, hostname, (err) => {
	if (err) console.log(`Error: ${err}`);
	console.log(`listening on port ${port}!`);
});

app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
