const jwt = require('jsonwebtoken');
const ChinchayError = require('../chinchayError');

let TheWall;

const ONE_HOUR = 60 * 60;
const DEFAULT_WINDOW = 7 * 24 * ONE_HOUR;
let WINDOW;
const secret = process.env.JWT_SECRET || 'JWT_CHINCHAY_SECRET_CODE';

const bootstrap = (thewall, chainfile) => {
  TheWall = thewall;
  chainfile = chainfile || {};
  WINDOW = chainfile.TOKEN_EXPIRATION_WINDOW || DEFAULT_WINDOW;
};

const unbootstrap = () => {
  TheWall = null;
  WINDOW = undefined;
};

const decode = async (req, res, next) => {
  try {
    delete req.user_id;
    addIsNotAuthenticated(req);
    req.chinchayAuthorization = {};
    const authorizationHeader = req.get('Authorization');
    req.chinchayAuthorization.hasHeader = true;
    const token = extractToken(authorizationHeader);
    req.chinchayAuthorization.hasToken = true;
    const decoded = decryptToken(token);
    req.chinchayAuthorization.decodedToken = true;
    await addIsAuthenticated(req, decoded);
    return next();
  } catch (error) {
    if (error.chinchayCode === 'middlewareMissingTheWall') console.log(`WARNING: ${error.message} req.isAuthenticatedByToken() will return false.`);
    return next();
  }
};

const addIsAuthenticated = async (req, decoded) => {
  if (!req || !decoded) return;
  if (!TheWall) throw new ChinchayError(new Error('TheWall should be defined in chainfile and accessToken bootstraped.'), 'middlewareMissingTheWall');
  req.isAuthenticatedByToken = () => {
    return true;
  };
  req.user = {};
  req.user.id = decoded.user;
  req.user.access = await TheWall.findAccess({ user_id: req.user.id });
};

const addIsNotAuthenticated = (req) => {
  if (!req) return;
  req.isAuthenticatedByToken = () => {
    return false;
  };
};

const extractToken = (header) => {
  if (!header) throw new Error('no authorization header defined');
  const parts = header.split('Bearer ');
  if (parts.length !== 2) throw new Error('Auth header badly defined');
  return parts[1];
};

const decryptToken = (token) => {
  const decoded = jwt.verify(token, secret);
  return decoded;
};

const hasExpired = (data) => {
  return !data || !data.exp || data.exp < new Date().getTime() / 1000;
};

const generate = (user, expirationWindow) => {
  if (!user) throw new Error('No User defined');
  expirationWindow = expirationWindow || DEFAULT_WINDOW
  const expirationDate = new Date(new Date().getTime() + expirationWindow * 1000);
  const token = jwt.sign(
    {
      user: user.id,
    },
    secret,
    { expiresIn: expirationWindow },
  );
  return {
    token,
    expiration: expirationDate,
  };
};

const PUBLIC_METHODS = {
  decode,
  generate,
  bootstrap,
};

if (process.env.NODE_ENV === 'test') {
  PUBLIC_METHODS.addIsAuthenticated = addIsAuthenticated;
  PUBLIC_METHODS.addIsNotAuthenticated = addIsNotAuthenticated;
  PUBLIC_METHODS.extractToken = extractToken;
  PUBLIC_METHODS.decryptToken = decryptToken;
  PUBLIC_METHODS.hasExpired = hasExpired;
  PUBLIC_METHODS.unbootstrap = unbootstrap;
}

module.exports = PUBLIC_METHODS;
