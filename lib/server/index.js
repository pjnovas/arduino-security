
import express from 'express';
import path from 'path';
//import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import lessMiddleware from 'less-middleware';

import routes from 'lib/routes';

const sessionMaxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
const staticsMaxAge = 365 * 24 * 60 * 60 * 1000; // 1 Year in ms

const app = express();

// view engine setup
app.set('views', 'views');
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware('public'));
app.use(express.static('public'));

/*
 * Route handlers. Each `section` of the hackdash provide their own router
 * The main app is in charge only of mounting the routers.
 */

app.use('/', routes);

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  var err = new Error('Not Found');
  res.sendStatus(404);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use( (err, req, res, next) => {
    console.dir(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use( (err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

export default app;
