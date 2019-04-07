const path = require('path');
const FileCreator = require('./fileCreator');

const samplePath = path.join(__dirname, '../', 'example', 'model.js');


const createFile = async (table_name, values, config) => {
  const Model = new FileCreator(samplePath, config.models.directory, `${values.MODELFILENAME}.js`);
  await Model.create(values);
};


function getName(table_name) {
  const parts = table_name.split('_');
  let name = '';
  for (let i = 0; i < parts.length; i++) {
    const elem = parts[i];
    name += elem.charAt(0).toUpperCase() + elem.substr(1);
  }
  return name;
}

function getFileName(modelName) {
  return modelName.charAt(0).toLowerCase() + modelName.substr(1);
}

module.exports = {
  createFile,
  getName,
  getFileName,
};
