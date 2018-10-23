
const path = require('path');
const fs = require('fs');
const Printer = require('./printer');
const Model = require('./model');
const Controller = require('./controller');
const Views = require('./views');
const Router = require('./routes');
let config = require('../.chainfile');
const configPath = require('./configPath');


const newMVC = (table_name) => {
  config = getConfig();
  if (typeof table_name !== 'string') {
    return Printer.error('Not valid model name');
  }
  console.log('EL CONFIG ES', config);
  const values = getValues(table_name);
  console.log(values);
  console.log('aca');
  Model.createFile(table_name, values, config);
  console.log('cac');
  Controller.createFile(table_name, values, config);
  Router.createFile(table_name, values, config);
  Views.createFile(table_name, values, config);
};

function getConfig() {
  const p = path.join(process.cwd(), '.chainfile.js');
  if (fs.existsSync(p)) {
    return require(p); // eslint-disable-line
  }
  return require('../.chainfile'); // eslint-disable-line
}

function getValues(table_name) {
  table_name = table_name.toLowerCase();
  const MODELNAME = Model.getName(table_name);
  const CONTROLLERNAME = Controller.getName(MODELNAME);
  const MODELFILENAME = Model.getFileName(MODELNAME);
  return {
    MODELFILENAME,
    MODELNAME,
    CONTROLLERNAME,
    CTRL2MODELPATH: path.relative(config.controllers.directory, path.join(config.models.directory, MODELFILENAME)),
    ROUTE2CTRL: path.relative(config.routes.directory, path.join(config.controllers.directory, CONTROLLERNAME)),
    CTRL2VIEWPATH: path.relative(config.controllers.directory, path.join(config.views.directory, MODELFILENAME)),
    TABLEPATH: path.relative(config.controllers.directory, configPath.TABLEPATH),
    HTTPRESPONSEPATH: path.relative(config.controllers.directory, configPath.HTTPRESPONSEPATH),
    TABLE_NAME: table_name,
    EXTENDPATH: path.relative(config.models.directory, config.models.superclass),
  };
}

module.exports = { new: newMVC };
