const FileCreator = require('./fileCreator');
const path = require('path');
const config = require('../.chainfile');

const samplePath = path.join(__dirname, '../', 'example', 'router.js');


const createFile = async(table_name, values) => {
  const filename = values.MODELNAME.charAt(0).toLowerCase() + values.MODELNAME.substr(1);
  const filePath = path.join(config.routes.directory, `${filename}.js`);
  const Controller = new FileCreator(samplePath, filePath);
  await Controller.create(values);
};


function getName(modelName) {
  const filename = modelName.charAt(0).toLowerCase() + modelName.substr(1);
  return `${filename}Controller`;
}

module.exports = {
  createFile,
  getName,
};
