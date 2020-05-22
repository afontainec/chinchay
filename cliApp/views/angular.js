const { execSync } = require('child_process');


const createFile = async (tableName, values, config) => {
  const APP_PATH = getAngularAppPath(config);
  await buildService(tableName, values, config, APP_PATH);
  // await createNewComponent(tableName, values, config);
  // await createReadComponent(tableName, values, config);
  // await createEditComponent(tableName, values, config);
  // await createIndexComponent(tableName, values, config);
  // createComponent(config);
};


// const createComponent = (config) => {
//   const appPath = getAngularAppPath(config);
//   const result = execSync(`cd '${appPath}' && ls`).toString();
// };

const buildService = (tableName, values, config, APP_PATH) => {
  const command = ngGenerateService(values, APP_PATH);
  const result = execSync(command).toString();
  console.log(result);
};

const ngGenerateService = (values, APP_PATH) => {
  const MODEL = values.MODELFILENAME;
  const command = `cd '${APP_PATH}' && ng generate service '${MODEL}/${MODEL}Service/${MODEL}'`;
  return command;
};


const getAngularAppPath = (config) => {
  config = config || {};
  config.views = config.views || {};
  return config.views.angular || '.';
};


module.exports = {
  createFile,
};
