const { execSync } = require('child_process');
const path = require('path');
const FileCreator = require('../fileCreator');


const SAMPLE_DIR = path.join(__dirname, '..', '..', 'example', 'views', 'angular');
// const files = ['service.ts'];
const serviceFile = 'service.ts';
const createFile = async (tableName, values, config) => {
  const APP_PATH = getAngularAppPath(config);
  await buildService(values, APP_PATH);
  await createNewComponent(values, APP_PATH);
  // await createReadComponent(tableName, values, config);
  // await createEditComponent(tableName, values, config);
  // await createIndexComponent(tableName, values, config);
  // createComponent(config);
};

const getAngularAppPath = (config) => {
  config = config || {};
  config.views = config.views || {};
  return config.views.angular || '.';
};


// #region SERVICE
const buildService = (values, APP_PATH) => {
  const command = ngGenerateService(values, APP_PATH);
  console.log(command);
  const result = execSync(command).toString();
  const [directory, filename] = getServicePath(APP_PATH, result);
  const sampleService = path.join(SAMPLE_DIR, serviceFile);
  console.log({ directory });
  console.log({ filename });
  const service = new FileCreator(sampleService, directory, filename);
  return service.create(values, true);
};

const ngGenerateService = (values, APP_PATH) => {
  const MODEL = values.MODELFILENAME;
  const servicePath = buildSchemaPath(MODEL, `${MODEL}-service`, MODEL);
  return ngGenerate('service', APP_PATH, servicePath);
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

// #endregion


const createNewComponent = (values, APP_PATH) => {
  const LOWERCASE = values.MODELFILENAME;
  const name = `new${values.MODELNAME}`;
  const sampleCtrlFile = path.join('new', 'ctrl.ts');
  const newPath = buildSchemaPath(LOWERCASE, name);
  const command = ngGenerate('component', APP_PATH, newPath);
  const result = execSync(command).toString();
  const { controller, html } = getComponentPath(APP_PATH, result);
  const sampleCtrl = path.join(SAMPLE_DIR, sampleCtrlFile);
  // const service = new FileCreator(sampleService, directory, filename);
  // return service.create(values, true);
};


const buildSchemaPath = (first, second, third) => {
  let schemaPath = path.join(first, second);
  if (third) schemaPath = path.join(schemaPath, third);
  return schemaPath;
};


const ngGenerate = (schema, APP_PATH, schemaPath) => {
  const command = `cd '${APP_PATH}' && ng generate ${schema} '${schemaPath}'`;
  return command;
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


module.exports = {
  createFile,
};
