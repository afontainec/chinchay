const path = require('path');
const FileCreator = require('./fileCreator');

const baseSamplePath = path.join(__dirname, '../', 'example', 'views');
const pages = ['index.ejs', 'show.ejs', 'edit.ejs', 'create.ejs'];

const createFile = async (table_name, values, config) => {
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
