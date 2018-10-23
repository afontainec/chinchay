const FileCreator = require('./fileCreator');
const path = require('path');
const config = require('../.chainfile');
const fs = require('fs');

const baseSamplePath = path.join(__dirname, '../', 'example', 'views');
const pages = ['index.ejs', 'show.ejs', 'edit.ejs', 'create.ejs'];

const createFile = async(table_name, values) => {
  const dir = path.join(config.views.directory, `${values.MODELFILENAME}`);
  fs.existsSync(dir) || fs.mkdirSync(dir); //eslint-disable-line
  const promises = [];
  for (let i = 0; i < pages.length; i++) {
    const filePath = path.join(dir, pages[i]);
    const samplePath = path.join(baseSamplePath, pages[i]);
    const View = new FileCreator(samplePath, filePath);
    promises.push(View.create(values));
  }
  return Promise.all(promises);
};


module.exports = {
  createFile,
};
