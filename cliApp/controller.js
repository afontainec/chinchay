const FileCreator = require('./fileCreator');
const path = require('path');

const samplePath = path.join(__dirname, '../', 'example', 'controller.js');


const createFile = async(table_name, values, config) => {
  const filename = values.CONTROLLERNAME.charAt(0).toLowerCase() + values.CONTROLLERNAME.substr(1);
  const filePath = path.join(config.controllers.directory, `${filename}.js`);
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
