const path = require('path');
const fs = require('fs');
const {
  promisify,
} = require('util');
const config = require('../.chainfile');

const samplePath = path.join(__dirname, '../', 'example', 'model.js');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const createFile = async (table_name) => {
  table_name = table_name.toLowerCase();
  const string = await readFile(samplePath, 'utf-8');
  const values = getValues(table_name);
  const file = compileString(string, values);
  const filePath = path.join(config.models.directory, `${table_name}.js`);
  await writeFile(filePath, file);
  return;
};

function getValues(table_name) {
  return {
    TABLE_NAME: table_name,
    MODELNAME: getModelName(table_name),
    TABLEPATH: path.relative(config.models.directory, config.models.superclass),
  };
}

function getModelName(table_name) {
  const parts = table_name.split('_');
  let name = '';
  for (let i = 0; i < parts.length; i++) {
    const elem = parts[i];
    name += elem.charAt(0).toUpperCase() + elem.substr(1);
  }
  return name;
}

const compileString = function (string, values) {
  const keys = Object.keys(values);
  for (let i = 0; i < keys.length; i++) {
    const inTextKey = '\\$' + keys[i] + '\\$'; // eslint-disable-line
    const search = new RegExp(inTextKey, 'g');
    string = string.replace(search, values[keys[i]]);
  }
  return string;
};


module.exports = {
  createFile,
};
