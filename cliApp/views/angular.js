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
  await createShowComponent(values, APP_PATH);
  await createEditComponent(values, APP_PATH);
  await createIndexComponent(values, APP_PATH);
};

const getAngularAppPath = (config) => {
  config = config || {};
  config.views = config.views || {};
  return config.views.angular || '.';
};


// #region SERVICE
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
  const component = {};
  component.sampleCtrl = path.join('new', 'ctrl.ts');
  component.sampleHTML = path.join('new', 'view.html');
  component.path = buildSchemaPath(LOWERCASE, name);
  return createComponent(APP_PATH, values, component);
};

const createIndexComponent = (values, APP_PATH) => {
  const LOWERCASE = values.MODELFILENAME;
  const name = `index${values.MODELNAME}`;
  const component = {};
  component.sampleCtrl = path.join('index', 'ctrl.ts');
  component.sampleHTML = path.join('index', 'view.html');
  component.path = buildSchemaPath(LOWERCASE, name);
  return createComponent(APP_PATH, values, component);
};

const createShowComponent = (values, APP_PATH) => {
  const LOWERCASE = values.MODELFILENAME;
  const name = `show${values.MODELNAME}`;
  const component = {};
  component.sampleCtrl = path.join('show', 'ctrl.ts');
  component.sampleHTML = path.join('show', 'view.html');
  component.path = buildSchemaPath(LOWERCASE, name);
  return createComponent(APP_PATH, values, component);
};

const createEditComponent = (values, APP_PATH) => {
  const LOWERCASE = values.MODELFILENAME;
  const name = `edit${values.MODELNAME}`;
  const component = {};
  component.sampleCtrl = path.join('edit', 'ctrl.ts');
  component.sampleHTML = path.join('edit', 'view.html');
  component.path = buildSchemaPath(LOWERCASE, name);
  return createComponent(APP_PATH, values, component);
};

const createComponent = (APP_PATH, values, component) => {
  const command = ngGenerate('component', APP_PATH, component.path);
  const result = execSync(command).toString();
  const { controller, html } = getComponentPath(APP_PATH, result);
  const sampleCtrl = path.join(SAMPLE_DIR, component.sampleCtrl);
  const ctrl = new FileCreator(sampleCtrl, controller[0], controller[1]);
  const sampleHTML = path.join(SAMPLE_DIR, component.sampleHTML);
  const htmlCreator = new FileCreator(sampleHTML, html[0], html[1]);
  return Promise.all([
    ctrl.create(values, true),
    htmlCreator.create(values, true),
  ]);
};

const getComponentPath = (APP_PATH, result) => {
  const lines = result.split(/\r?\n/);
  const tsFile = getTSFile(lines);
  const controllerPath = path.join(APP_PATH, tsFile);
  const controller = [path.dirname(controllerPath), path.basename(controllerPath)];
  const htmlFile = getHTMLFile(lines);
  const viewPath = path.join(APP_PATH, htmlFile);
  const html = [path.dirname(viewPath), path.basename(viewPath)];
  return { controller, html };
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

const getHTMLFile = (lines) => {
  for (let i = 0; i < lines.length; i++) {
    const element = lines[i];
    if (element.includes('.html')) {
      const pieces = element.split(' ');
      return pieces[1];
    }
  }
  throw new Error(`Could not create angular: missing TS FILE in ${lines}`);
};


module.exports = {
  createFile,
};
