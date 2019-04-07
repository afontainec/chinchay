const path = require('path');
const FileCreator = require('./fileCreator');

const samplePath = path.join(__dirname, '../', 'example', 'migration.js');


const createFile = async (table_name, values, config, knexConfig) => {
  const filename = getFileName(knexConfig, values.TABLE_NAME);
  const Migration = new FileCreator(samplePath, knexConfig.migrations.directory, filename);
  await Migration.create(values);
};

const getFileName = (knexConfig, table_name) => {
  const now = new Date();
  let filename = `${1900 + now.getYear()}`;
  filename += now.getMonth() < 9 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
  filename += now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
  filename += now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
  filename += now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
  filename += now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds();
  filename += `_${table_name}.js`;
  return filename;
};


module.exports = {
  createFile,
};
