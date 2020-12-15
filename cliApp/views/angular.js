const { execSync } = require('child_process');
const path = require('path');
const FileCreator = require('../fileCreator');


const SAMPLE_DIR = path.join(__dirname, '..', '..', 'example', 'views', 'angular');
// const files = ['service.ts'];
const serviceFile = 'service.ts';
const moduleFile = 'module.ts';
const serviceTestFile = 'service.spec.ts';
const routerFile = 'router.ts';

const createFile = async (tableName, values, config) => {
  const APP_PATH = getAngularAppPath(config);
  await buildModule(values, APP_PATH);
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

// #region MODULE
const buildModule = async (values, APP_PATH) => {
  const command = ngGenerateModule(values, APP_PATH);
  const result = execSync(command).toString();
  const [modulePath, routerPath] = getModulePath(APP_PATH, result);
  await Promise.all([
    fillModule(values, modulePath),
    buildRouter(values, routerPath)]);
};

const ngGenerateModule = (values, APP_PATH) => {
  const NAME = values.KEBAB_CASE;
  return ngGenerate('module', APP_PATH, NAME, '--routing');
};

const getModulePath = (APP_PATH, result) => {
  const lines = result.split(/\r?\n/);
  const [moduleFilename,, routingFile] = getTSFile(lines);
  return [path.join(APP_PATH, moduleFilename), path.join(APP_PATH, routingFile)];
};

const fillModule = (values, modulePath) => {
  const directory = path.dirname(modulePath);
  const filename = path.basename(modulePath);
  const sampleModule = path.join(SAMPLE_DIR, moduleFile);
  const module = new FileCreator(sampleModule, directory, filename);
  return module.create(values, true);
};


// #endregion

// #region SERVICE
const buildService = async (values, APP_PATH) => {
  const command = ngGenerateService(values, APP_PATH);
  const result = execSync(command).toString();
  const [directory, filename, testFilename] = getServicePath(APP_PATH, result);
  await Promise.all(
    [fillService(values, directory, filename), fillTestService(values, directory, testFilename)],
  );
  return directory;
};

const fillService = (values, directory, filename) => {
  const sampleService = path.join(SAMPLE_DIR, serviceFile);
  const service = new FileCreator(sampleService, directory, filename);
  return service.create(values, true);
};

const fillTestService = (values, directory, filename) => {
  const sampleService = path.join(SAMPLE_DIR, serviceTestFile);
  const service = new FileCreator(sampleService, directory, filename);
  return service.create(values, true);
};

const ngGenerateService = (values, APP_PATH) => {
  const NAME = values.KEBAB_CASE;
  const servicePath = buildSchemaPath(NAME, `${NAME}-service`, NAME);
  return ngGenerate('service', APP_PATH, servicePath);
};

const getServicePath = (APP_PATH, result) => {
  const lines = result.split(/\r?\n/);
  const [tsFile, tsTestFile] = getTSFile(lines);
  const servicePath = path.join(APP_PATH, tsFile);
  const serviceTestPath = path.join(APP_PATH, tsTestFile);
  return [
    path.dirname(servicePath),
    path.basename(servicePath),
    path.basename(serviceTestPath),
  ];
};

// #endregion


const createNewComponent = (values, APP_PATH) => {
  const component = buildComponentURIs('new', values);
  return createComponent(APP_PATH, values, component);
};

const createIndexComponent = (values, APP_PATH) => {
  const component = buildComponentURIs('index', values);
  return createComponent(APP_PATH, values, component);
};

const createShowComponent = (values, APP_PATH) => {
  const component = buildComponentURIs('show', values);
  return createComponent(APP_PATH, values, component);
};

const createEditComponent = (values, APP_PATH) => {
  const component = buildComponentURIs('edit', values);
  return createComponent(APP_PATH, values, component);
};

const buildComponentURIs = (prefix, values) => {
  const { KEBAB_CASE } = values;
  const name = `${prefix}${values.PASCAL_CASE}`;
  const component = {};
  component.sampleCtrl = path.join(prefix, 'ctrl.ts');
  component.sampleHTML = path.join(prefix, 'view.html');
  component.sampleTest = path.join(prefix, 'spec.ts');
  component.path = buildSchemaPath(KEBAB_CASE, name);
  return component;
};

const createComponent = (APP_PATH, values, component) => {
  const command = ngGenerate('component', APP_PATH, component.path);
  const result = execSync(command).toString();
  const { controller, html, test } = getComponentPath(APP_PATH, result);
  const sampleCtrl = path.join(SAMPLE_DIR, component.sampleCtrl);
  const ctrl = new FileCreator(sampleCtrl, controller[0], controller[1]);
  const sampleHTML = path.join(SAMPLE_DIR, component.sampleHTML);
  const htmlCreator = new FileCreator(sampleHTML, html[0], html[1]);
  const sampleTest = path.join(SAMPLE_DIR, component.sampleTest);
  const testCreator = new FileCreator(sampleTest, test[0], test[1]);
  return Promise.all([
    ctrl.create(values, true),
    htmlCreator.create(values, true),
    testCreator.create(values, true),
  ]);
};

const getComponentPath = (APP_PATH, result) => {
  const lines = result.split(/\r?\n/);
  const [tsFile, tsTestFile] = getTSFile(lines);
  const controllerPath = path.join(APP_PATH, tsFile);
  const controller = [path.dirname(controllerPath), path.basename(controllerPath)];
  const testPath = path.join(APP_PATH, tsTestFile);
  const test = [path.dirname(controllerPath), path.basename(testPath)];
  const htmlFile = getHTMLFile(lines);
  const viewPath = path.join(APP_PATH, htmlFile);
  const html = [path.dirname(viewPath), path.basename(viewPath)];
  return { controller, html, test };
};


const buildSchemaPath = (first, second, third) => {
  let schemaPath = path.join(first, second);
  if (third) schemaPath = path.join(schemaPath, third);
  return schemaPath;
};


const ngGenerate = (schema, APP_PATH, schemaPath, flags = '') => {
  const command = `ng generate ${schema} ${schemaPath} ${flags}`;
  return command;
};

const getTSFile = (lines) => {
  let tsFile;
  let tsTestFile;
  let routingFile;
  for (let i = 0; i < lines.length; i++) {
    const element = lines[i];
    if (element.includes('.ts') && element.startsWith('CREATE')) {
      const pieces = element.split(' ');
      if (element.includes('.spec.ts')) [, tsTestFile] = pieces;
      else if (element.includes('-routing.module.ts')) [, routingFile] = pieces;
      else [, tsFile] = pieces;
    }
  }
  return [tsFile, tsTestFile, routingFile];
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

const buildRouter = (values, routerPath) => {
  const directory = path.dirname(routerPath);
  const filename = path.basename(routerPath);
  const sample = path.join(SAMPLE_DIR, routerFile);
  const service = new FileCreator(sample, directory, filename);
  return service.create(values, true);
};


module.exports = {
  createFile,
};
