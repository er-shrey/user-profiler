const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const compression = require('compression');
var swig = require("swig");
const config = require('./config/config');
const db = require('./config/database/database');

/* Testing Database connection */
db.authenticate()
  .then(() => console.log("\x1b[33m%s\x1b[0m", "Connected to Database"))
  .catch(err => console.log("\x1b[31m%s\x1b[0m", "Database connection error: " + err))

/* Cron Jobs */
const newUserMail = require('./cronJobs/newUserMailCron');

/* Routers */
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

/* Starting cron schedules */
newUserMail.start();

/* Setting up view engine */
app.set('views', path.join(__dirname, 'client/production'));
app.set('view engine', 'html');
app.engine("html",swig.renderFile);
swig.setDefaults({ varControls: ['<%=', '%>'] });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* App session configuration */
app.use(session({
  secret: config.tokenSecretKey,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

/* Response compression configuration */
app.use(compression({ filter: shouldCompress }));

/* Serving Static Files */
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('client/production/user-profiler/'));

/* Linking pages */
app.use('/', indexRouter);
app.use('/api', apiRouter);

app.use(function(req, res, next){
  res.status(404);
  /* For HTML Pages */
  if (req.accepts('html')) {
    res.render('error404.html');
    return;
  }
  /* For JSON responses */
  if (req.accepts('json')) {
    res.send({ error: '404 Not found' });
    return;
  }
  /* Default text response */
  res.type('txt').send('404 Not found');
});

module.exports = app;

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    /* No compression if `x-no-compression` header */
    return false
  }
  /* Compress by default */
  return compression.filter(req, res)
}
