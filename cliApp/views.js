const path = require('path');
const FileCreator = require('./fileCreator');
const Printer = require('./printer');
const AngularViews = require('./views/angular');

const baseSamplePath = path.join(__dirname, '../', 'example', 'views');
const pages = ['index.ejs', 'show.ejs', 'edit.ejs', 'create.ejs'];

const createFile = (tableName, values, config, frontend) => {
  if (frontend === 'ejs') return createAsEJS(tableName, values, config);
  if (frontend === 'angular') return AngularViews.createFile(tableName, values, config);
  Printer.error(`Frontend ${frontend} is not a valid option. Omitted.`);
  return Promise.resolve();
};

const createAsEJS = async (table_name, values, config) => {
  const dir = path.join(config.views.directory, `${values.MODELFILENAME}`);
  const promises = [];
  for (let i = 0; i < pages.length; i++) {
    const samplePath = path.join(baseSamplePath, pages[i]);
    const View = new FileCreator(samplePath, dir, pages[i]);
    promises.push(View.create(values));
  }
  return Promise.all(promises);
};


module.exports = {
  createFile,
};
