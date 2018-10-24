const FileCreator = require('./fileCreator');
const path = require('path');

const samplePath = path.join(__dirname, '../', 'example', 'migration.js');


const createFile = async(table_name, values, config, knexConfig) => {
  const filePath = getFilePath(knexConfig, values.TABLE_NAME);
  const Migration = new FileCreator(samplePath, filePath);
  await Migration.create(values);
};

const getFilePath = (knexConfig, table_name) => {
  const now = new Date();
  let filename = `${1900 + now.getYear()}`;
  filename += now.getMonth() < 10 ? `0${now.getMonth()}` : now.getMonth();
  filename += now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
  filename += now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
  filename += now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
  filename += now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds();
  filename += `_${table_name}.js`;

  return path.join(knexConfig.migrations.directory, filename);
};


module.exports = {
  createFile,
};
