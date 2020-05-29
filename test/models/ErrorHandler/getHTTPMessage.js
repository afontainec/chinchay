/* global describe, it */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const { ErrorHandler } = require('../../..');


// Our parent block
// eslint-disable-next-line max-lines-per-function
describe('Error Handler intialize', () => {

  it('code is in translate', async () => {
    const error = { chinchayCode: 42703 };
    const handler = new ErrorHandler();
    const message = handler.getHTTPMessage(error);
    const expected = 'Columna solicitada no existe.';
    assert.equal(message, expected);
  });

  it('code is not in translate', async () => {
    const error = { chinchayCode: 427031 };
    const handler = new ErrorHandler();
    const message = handler.getHTTPMessage(error);
    const expected = 'Internal Error';
    assert.equal(message, expected);
  });

  it('code is not in translate but has chinchayMessage', async () => {
    const error = { chinchayCode: 427031, chinchayMessage: 'this is the error' };
    const handler = new ErrorHandler();
    const message = handler.getHTTPMessage(error);
    const expected = 'this is the error';
    assert.equal(message, expected);
  });

  it('error is undefined', async () => {
    const handler = new ErrorHandler();
    const message = handler.getHTTPMessage();
    const expected = 'Internal Error';
    assert.equal(message, expected);
  });
});
