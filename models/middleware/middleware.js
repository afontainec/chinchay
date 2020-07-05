const { httpResponse } = require('codemaster');
const ErrorHandler = require('../ErrorHandler');
const ForbiddenError = require('../ForbiddenError');
const AccessToken = require('./accessToken');

let TheWall;

const errorHandler = new ErrorHandler();

const hasAccess = async (req, res, next) => {
  if (!req.isAuthenticatedByToken) console.log('WARNING: req.isAuthenticatedByToken is not a function. Make sure the that middleware.prerouting(app) is called before the routes are defined. Access rejected by default.');
  if (!req.isAuthenticatedByToken || !req.isAuthenticatedByToken()) return forbidden(req, res);
  let fullUrl = req.baseUrl + req.path;
  if (fullUrl.endsWith('/')) fullUrl = fullUrl.substring(0, fullUrl.length - 1);
  const userId = req.user.id;
  const canGoThrough = await TheWall.hasAccess(userId, fullUrl, req.method);
  return canGoThrough ? next() : forbidden(req, res);
};


// function logout(req, res) {
//   // if they aren't redirect them to the home page
//   if (req) req.logout();
//   if (res) res.redirect('/');
// }

function forbidden(req, res) {
  const error = new ForbiddenError();
  const { code, message } = errorHandler.getHTTPCodeAndMessage(error);
  const json = httpResponse.error(message, error, code);
  return res.status(code).send(json);
}

// ////////////////////////////
// ////// PREROUTING /////////
// //////////////////////////

function prerouting(app) {
  app.enable('trust proxy'); // Trust heroku proxy to know if the request was https

  app.use(setHeadersForAccessToken);
  app.use(AccessToken.decode);
}

const setHeadersForAccessToken = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
};

// ////////////////////////////
// ////// POSTROUTING ////////
// //////////////////////////


function postrouting(app) {
  app.use(notFoundError); // catch 404 and forward to error handler
  errSplashPage(app);
}

function errSplashPage(app) {
  // for dev: print whole error
  if (app.get('env') === 'development') app.use(errorSplashWithError);
  // for production: no stacktraces leaked to user
  app.use(errorSplashWithoutError);
}

const errorSplashWithError = (err, req, res) => {
  res.status(err.status || 500);
  res.json('error', {
    message: err.message,
    error: err,
  });
};

const errorSplashWithoutError = (err, req, res) => {
  res.status(err.status || 500);
  res.json('error', {
    message: err.message,
    error: {},
  });
};


const notFoundError = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};


const PUBLIC_METHODS = {
  hasAccess,
  prerouting,
  postrouting,
};

if (process.env.NODE_ENV === 'test') {
  PUBLIC_METHODS.forbidden = forbidden;
  PUBLIC_METHODS.notFoundError = notFoundError;
  PUBLIC_METHODS.errorSplashWithoutError = errorSplashWithoutError;
  PUBLIC_METHODS.errorSplashWithError = errorSplashWithError;
  PUBLIC_METHODS.errSplashPage = errSplashPage;
  PUBLIC_METHODS.setHeadersForAccessToken = setHeadersForAccessToken;
}

module.exports = (thewall) => {
  TheWall = thewall;
  return PUBLIC_METHODS;
};
