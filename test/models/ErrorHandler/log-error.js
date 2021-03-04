/* global describe, it */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const { ErrorHandler } = require('../../..');


// Our parent block
// eslint-disable-next-line max-lines-per-function
describe('Error Handler sendError', () => {

  it('no logger', async () => {
    const error = { chinchayCode: 'any_code' };
    const handler = new ErrorHandler();
    handler.logger = null;
    handler.logError({ 500: 'text' }, 500, error);
  });

  it('without configuration', async () => {
    const error = { chinchayCode: 'any_code' };
    let loggedParameters;
    const logger = (...params) => { loggedParameters = params; };
    const handler = new ErrorHandler(null, null, logger);
    handler.logError(null, 500, error);
    assert.deepEqual(loggedParameters, undefined);
  });

  it('without configuration[code]', async () => {
    const error = { chinchayCode: 'any_code' };
    let loggedParameters;
    const logger = (...params) => { loggedParameters = params; };
    const handler = new ErrorHandler(null, null, logger);
    handler.logError({ 400: 'test' }, 500, error);
    assert.deepEqual(loggedParameters, undefined);
  });

  it('without configuration[code].text', async () => {
    const error = { chinchayCode: 'any_code' };
    let loggedParameters;
    const logger = (...params) => { loggedParameters = params; };
    const handler = new ErrorHandler(null, null, logger);
    handler.logError({ 500: 'test' }, 500, error);
    assert.deepEqual(loggedParameters, ['test', 500, error]);
  });

  it('with configuration[code].text', async () => {
    const error = { chinchayCode: 'any_code' };
    let loggedParameters;
    const logger = (...params) => { loggedParameters = params; };
    const handler = new ErrorHandler(null, null, logger);
    handler.logError({ 500: { text: 'test text' } }, 500, error);
    assert.deepEqual(loggedParameters, ['test text', 500, error]);
  });
});
