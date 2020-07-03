const path = require('path');
const FileCreator = require('./fileCreator');

const samplePath = path.join(__dirname, '../', 'example', 'router.js');
const apiSample = path.join(__dirname, '../', 'example', 'routerApi.js');


const createFile = async (values, config) => {
  const p1 = createRoutes(values, config);
  const p2 = createAPIRoutes(values, config);
  await Promise.all([p1, p2]);
};

function createRoutes(values, config) {
  const Route = new FileCreator(samplePath, config.routes.directory, `${values.MODELFILENAME}.js`);
  return Route.create(values);
}

function createAPIRoutes(values, config) {
  const Route = new FileCreator(apiSample, config.routes.directory, `${values.MODELFILENAME}API.js`);
  return Route.create(values);
}


module.exports = {
  createFile,
};
