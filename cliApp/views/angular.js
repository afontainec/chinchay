const { execSync } = require('child_process');


const createFile = async (tableName, values, config) => {
  createComponent(config);
};


const createComponent = (config) => {
  const appPath = getAngularAppPath(config);
  const result = execSync(`cd '${appPath}' && ls`).toString();
};


const getAngularAppPath = (config) => {
  config = config || {};
  config.views = config.views || {};
  return config.views.angular || '.';
};


module.exports = {
  createFile,
};
