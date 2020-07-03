const path = require('path');
const fs = require('fs');
const Table = require('./models/table');
const Hateoas = require('./models/hateoas');
const Access = require('./models/access');
const ErrorHandler = require('./models/ErrorHandler');
const ChinchayError = require('./models/chinchayError');
const ForbiddenError = require('./models/ForbiddenError');

let access;
let thewall;
let Middleware;

const chainConfig = getConfig();

const knex = require(chainConfig.knex); // eslint-disable-line import/no-dynamic-require
// eslint-disable-next-line global-require
if (chainConfig.access) access = require(chainConfig.access); // eslint-disable-line import/no-dynamic-require
// eslint-disable-next-line global-require
if (chainConfig.thewall) thewall = require(chainConfig.thewall); // eslint-disable-line import/no-dynamic-require
// eslint-disable-next-line global-require
if (thewall) Middleware = require('./models/middleware/middleware')(thewall);


function getConfig() {
  const p = path.join(process.cwd(), '.chainfile.js');
  if (fs.existsSync(p)) {
    return require(p); // eslint-disable-line
  }
  return require('.chainfile'); // eslint-disable-line
}

Table.setDefaultKnex(knex);
if (access && thewall) Access.bootstrap(access, thewall);

module.exports = {
  Table,
  Hateoas,
  Access,
  ErrorHandler,
  ForbiddenError,
  ChinchayError,
  Middleware,
};
