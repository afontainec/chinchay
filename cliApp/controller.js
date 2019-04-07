const path = require('path');
const FileCreator = require('./fileCreator');

const samplePath = path.join(__dirname, '../', 'example', 'controller.js');


const createFile = async (tableName, values, config) => {
  const filename = values.CONTROLLERNAME.charAt(0).toLowerCase() + values.CONTROLLERNAME.substr(1);
  const Controller = new FileCreator(samplePath, config.controllers.directory, `${filename}.js`);
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
