
const path = require('path');
const fs = require('fs');
const Printer = require('./printer');
const Model = require('./model');
const Controller = require('./controller');
const Views = require('./views');
const Router = require('./routes');
const Migration = require('./migrations');

let config = require('../.chainfile');

let knexConfig;

const configPath = require('./configPath');


const newMVC = (tableName, options) => {
  config = getConfig();
  knexConfig = getKnexConfig();
  if (typeof tableName !== 'string') {
    return Printer.error('Not valid model name');
  }
  const values = getValues(tableName);
  const promises = [];
  promises.push(Model.createFile(tableName, values, config));
  promises.push(Controller.createFile(tableName, values, config));
  promises.push(Router.createFile(tableName, values, config));
  if (shouldCreateFrontend(options)) promises.push(Views.createFile(tableName, values, config));
  promises.push(Migration.createFile(tableName, values, config, knexConfig));
  Promise.all(promises).then().catch((err) => {
    console.log(err); // eslint-disable-line no-console
  });
};


const shouldCreateFrontend = (options) => {
  return options && options.frontend !== 'disabled';
};

function getConfig() {
  const p = path.join(process.cwd(), '.chainfile.js');
  if (fs.existsSync(p)) {
    return require(p); // eslint-disable-line
  }
  return require('../.chainfile'); // eslint-disable-line
}

function getKnexConfig() {
  const p = config.knexfile;
  const environment = process.env.NODE_ENV || 'development';
  if (fs.existsSync(p)) {
    return require(p)[environment]; // eslint-disable-line
  }
  const defaultPath = path.join(process.cwd(), '/knexfile.js');
  if (fs.existsSync(defaultPath)) {
    return require(defaultPath)[environment]; // eslint-disable-line
  }
  return defaultKnex(); // eslint-disable-line
}

function defaultKnex() {
  return {
    migrations: {
      directory: path.join(process.cwd(), '/chinchapp/migrations'),
    },
  };
}

function getValues(tableName) {
  tableName = tableName.toLowerCase();
  const MODELNAME = Model.getName(tableName);
  const CONTROLLERNAME = Controller.getName(MODELNAME);
  const MODELFILENAME = Model.getFileName(MODELNAME);
  return {
    MODELFILENAME,
    MODELNAME,
    CONTROLLERNAME,
    CTRL2MODELPATH: path.relative(config.controllers.directory, path.join(config.models.directory, MODELFILENAME)).replace(/\\/g, '/'),
    ROUTE2CTRL: path.relative(config.routes.directory, path.join(config.controllers.directory, CONTROLLERNAME)).replace(/\\/g, '/'),
    CTRL2VIEWPATH: path.relative(config.controllers.directory, path.join(config.views.directory, MODELFILENAME)).replace(/\\/g, '/'),
    TABLEPATH: path.relative(config.controllers.directory, configPath.TABLEPATH).replace(/\\/g, '/'),
    tableName,
  };
}

module.exports = { new: newMVC };
