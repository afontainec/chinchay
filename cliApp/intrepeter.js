
const path = require('path');
const fs = require('fs');
const Printer = require('./printer');
const Model = require('./model');
const Controller = require('./controller');
const Views = require('./views');
const Router = require('./routes');
const Migration = require('./migrations');
let config = require('../.chainfile');
const configPath = require('./configPath');

let knexConfig;

const DEFAULT_FRONTEND = 'ejs';
const DEFAULT_BACKEND = 'enable';
const DEFAULT = {
  frontend: 'ejs',
  backend: 'enable',
  middleware: 'disable',
};


const newMVC = (tableName, options) => {
  config = getConfig();
  knexConfig = getKnexConfig();
  if (typeof tableName !== 'string') {
    Printer.error('Not valid model name');
    return;
  }
  const frontendType = getFrontendType(options);
  const backend = getBackend(options);
  const values = getValues(tableName, options, config);
  const promises = createFiles(frontendType, backend, tableName, values);
  Promise.all(promises).then().catch(() => { Printer.error('Error creating files'); });
};

const createFiles = (frontendType, backend, tableName, values) => {
  const promises = [];
  if (shouldCreate(frontendType)) {
    promises.push(Views.createFile(tableName, values, config, frontendType));
  }
  if (shouldCreate(backend)) {
    promises.push(Model.createFile(tableName, values, config));
    promises.push(Controller.createFile(tableName, values, config));
    promises.push(Router.createFile(values, config));
    promises.push(Migration.createFile(tableName, values, config, knexConfig));
  }
  return promises;
};


const shouldCreate = (type) => {
  return type !== 'disable';
};

const getBackend = (options) => {
  options = options || {};
  const configBackend = config ? config.backend : null;
  return options.backend || configBackend || DEFAULT_BACKEND;
};


const getFrontendType = (options) => {
  options = options || {};
  const configFrontend = config ? config.frontend : null;
  return options.frontend || configFrontend || DEFAULT_FRONTEND;
};

function getConfig() {
  const p = path.join(process.cwd(), '.chainfile.js');
  if (fs.existsSync(p)) {
    return require(p); // eslint-disable-line
  }
  return require('../.defaultchainfile'); // eslint-disable-line
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

function getValues(tableName, options) {
  let values = getNameValues(tableName);
  values = addMiddlewareValues(values, options);
  return values;
}

// #region GETNAMEVALUES
// eslint-disable-next-line max-lines-per-function
const getNameValues = (tableName) => {
  tableName = parseCamelCase(tableName);
  tableName = parseKebabCase(tableName);
  tableName = tableName.toLowerCase();
  const words = tableName.split('_');
  const MODELNAME = Model.getName(tableName);
  const CONTROLLERNAME = Controller.getName(MODELNAME);
  const MODELFILENAME = Model.getFileName(MODELNAME);
  return {
    FLAT_CASE: toFlatCase(words),
    PASCAL_CASE: toPascalCase(words),
    CAMEL_CASE: toCamelCase(words),
    SNAKE_CASE: toSnakeCase(words),
    KEBAB_CASE: toKebabCase(words),
    TRAIN_CASE: toTrainCase(words),
    MACRO_CASE: toMacroCase(words),
    MODELFILENAME,
    MODELNAME,
    CONTROLLERNAME,
    CTRL2MODELPATH: path.relative(config.controllers.directory, path.join(config.models.directory, MODELFILENAME)).replace(/\\/g, '/'),
    ROUTE2CTRL: path.relative(config.routes.directory, path.join(config.controllers.directory, CONTROLLERNAME)).replace(/\\/g, '/'),
    CTRL2VIEWPATH: path.relative(config.controllers.directory, path.join(config.views.directory, MODELFILENAME)).replace(/\\/g, '/'),
    TABLEPATH: path.relative(config.controllers.directory, configPath.TABLEPATH).replace(/\\/g, '/'),
    TABLE_NAME: tableName,
  };
};


const parseCamelCase = (input) => {
  return input.replace(/([a-z0-9])([A-Z])/g, '$1_$2');
};

const parseKebabCase = (input) => {
  return input.replace(/-/g, '_');
};

const toCamelCase = (array) => {
  array = array || [];
  let result = '';
  if (array[0]) result += array[0];
  for (let i = 1; i < array.length; i++) {
    const element = array[i];
    result += capitalizeFirstLetter(element);
  }
  return result;
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const toSnakeCase = (array) => {
  array = array || [];
  return array.join('_');
};

const toKebabCase = (array) => {
  array = array || [];
  return array.join('-');
};

const toFlatCase = (array) => {
  array = array || [];
  return array.join('');
};

const toPascalCase = (array) => {
  return capitalizeFirstLetter(toCamelCase(array));
};

const toTrainCase = (array) => {
  return toKebabCase(array).toUpperCase();
};

const toMacroCase = (array) => {
  return toSnakeCase(array).toUpperCase();
};

// #endregion

const addMiddlewareValues = (values, options) => {
  const middleware = getOption('middleware', options);
  values = values || {};
  const addToFrontend = ['frontend', 'enable', 'true'].includes(middleware);
  values.MIDDLEWAREFRONTEND = addToFrontend ? 'Middleware.hasAccess, ' : '';
  const addToAPI = ['api', 'enable', 'true'].includes(middleware);
  values.MIDDLEWAREAPI = addToAPI ? 'Middleware.hasAccess, ' : '';
  return values;
};

const getOption = (key, options) => {
  options = options || {};
  const configOption = config ? config[key] : null;
  const value = options[key] || configOption || DEFAULT[key];
  return value.toString().toLowerCase();

};

module.exports = { new: newMVC };
