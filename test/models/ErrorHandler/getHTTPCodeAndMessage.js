/* global describe, it */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const { ErrorHandler } = require('../../..');


// Our parent block
// eslint-disable-next-line max-lines-per-function
describe('Error Handler getHttpCodeAndMessage', () => {

  it('code is in translate', async () => {
    const error = { chinchayCode: 42703 };
    const handler = new ErrorHandler();
    const { code, message } = handler.getHTTPCodeAndMessage(error);
    const expected = 400;
    const expectedMessage = 'Columna solicitada no existe.';
    assert.equal(code, expected);
    assert.equal(message, expectedMessage);
  });
});
