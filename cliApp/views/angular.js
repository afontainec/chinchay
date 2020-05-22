const { execSync } = require('child_process');
const path = require('path');
const FileCreator = require('../fileCreator');


const SAMPLE_DIR = path.join(__dirname, '..', '..', 'example', 'views', 'angular');
// const files = ['service.ts'];
const serviceFile = 'service.ts';
const createFile = async (tableName, values, config) => {
  const APP_PATH = getAngularAppPath(config);
  await buildService(values, APP_PATH);
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

const buildService = (values, APP_PATH) => {
  const command = ngGenerateService(values, APP_PATH);
  const result = execSync(command).toString();
  const [directory, filename] = getServicePath(APP_PATH, result);
  const sampleService = path.join(SAMPLE_DIR, serviceFile);
  const service = new FileCreator(sampleService, directory, filename);
  return service.create(values, true);
};

const ngGenerateService = (values, APP_PATH) => {
  const MODEL = values.MODELFILENAME;
  const command = `cd '${APP_PATH}' && ng generate service '${MODEL}/${MODEL}Service/${MODEL}'`;
  return command;
};

const getServicePath = (APP_PATH, result) => {
  const lines = result.split(/\r?\n/);
  const tsFile = getTSFile(lines);
  const servicePath = path.join(APP_PATH, tsFile);
  return [
    path.dirname(servicePath),
    path.basename(servicePath),
  ];
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
