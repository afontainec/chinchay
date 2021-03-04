/* global describe, it */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const Res = require('codemaster').utils.mocks.express.res;
const { ErrorHandler } = require('../../..');


// Our parent block
// eslint-disable-next-line max-lines-per-function
describe('Error Handler sendError', () => {

  it('happy path', async () => {
    const error = { chinchayCode: 'any_code' };
    const handler = new ErrorHandler();
    const res = Res.generate();
    handler.sendError(error, res);
    assert.equal(res.statusToSend, 500);
    assert.deepEqual(res.sending.error, 'Internal Server Error');
  });

  it('with logger', async () => {
    const error = { chinchayCode: 'any_code' };
    let loggedParameters;
    const logger = (...params) => { loggedParameters = params; };
    const handler = new ErrorHandler(null, null, logger);
    const res = Res.generate();
    handler.sendError(error, res, { 500: 'test' });
    assert.deepEqual(loggedParameters, ['test', 500, error]);
  });
});
