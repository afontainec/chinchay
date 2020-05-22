const { execSync } = require('child_process');
const path = require('path');

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
  const servicePath = getServicePath(APP_PATH, result);
  console.log(servicePath);
};

const ngGenerateService = (values, APP_PATH) => {
  const MODEL = values.MODELFILENAME;
  const command = `cd '${APP_PATH}' && ng generate service '${MODEL}/${MODEL}Service/${MODEL}'`;
  return command;
};

const getServicePath = (APP_PATH, result) => {
  const lines = result.split(/\r?\n/);
  const tsFile = getTSFile(lines);
  return path.join(APP_PATH, tsFile);

};

const getTSFile = (lines) => {
  for (let i = 0; i < lines.length; i++) {
    const element = lines[i];
    if (element.includes('.ts') && !element.includes('.spec.ts')) {
      const pieces = element.split(' ');
      return pieces[1];
    }
  }
  throw new Error(`Could not create angular: missing TS FILE in ${lines}`);
};


const getAngularAppPath = (config) => {
  config = config || {};
  config.views = config.views || {};
  return config.views.angular || '.';
};


module.exports = {
  createFile,
};
