const FileCreator = require('./fileCreator');
const path = require('path');

const samplePath = path.join(__dirname, '../', 'example', 'router.js');
const apiSample = path.join(__dirname, '../', 'example', 'routerApi.js');


const createFile = async(table_name, values, config) => {
  const p1 = createRoutes(table_name, values, config);
  const p2 = createAPIRoutes(table_name, values, config);
  await Promise.all([p1, p2]);
};

function createRoutes(table_name, values, config) {
  const Route = new FileCreator(samplePath, config.routes.directory, `${values.MODELFILENAME}.js`);
  return Route.create(values);
}

function createAPIRoutes(table_name, values, config) {
  const Route = new FileCreator(apiSample, config.routes.directory, `${values.MODELFILENAME}API.js`);
  return Route.create(values);
}


module.exports = {
  createFile,
};
