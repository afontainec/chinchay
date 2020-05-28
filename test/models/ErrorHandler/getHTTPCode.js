/* global describe, it */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const { ErrorHandler } = require('../../..');


// Our parent block
// eslint-disable-next-line max-lines-per-function
describe('Error Handler getHttpCode', () => {

  it('code is in translate', async () => {
    const error = { chinchayCode: 42703 };
    const handler = new ErrorHandler();
    const code = handler.getHTTPCode(error);
    const expected = 400;
    assert.equal(code, expected);
  });

  it('code is not in translate', async () => {
    const error = { chinchayCode: 427031 };
    const handler = new ErrorHandler();
    const code = handler.getHTTPCode(error);
    const expected = 500;
    assert.equal(code, expected);
  });

  it('code is not in translator but has suggestedHTTPCode', async () => {
    const error = { chinchayCode: 427031, suggestedHTTPCode: 403 };
    const handler = new ErrorHandler();
    const code = handler.getHTTPCode(error);
    const expected = 403;
    assert.equal(code, expected);
  });

  it('error is undefined', async () => {
    const handler = new ErrorHandler();
    const code = handler.getHTTPCode();
    const expected = 500;
    assert.equal(code, expected);
  });
});
