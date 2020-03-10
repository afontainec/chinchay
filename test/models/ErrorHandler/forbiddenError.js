/* global describe, it */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const { ErrorHandler, ForbiddenError } = require('../../..');


// Our parent block
// eslint-disable-next-line max-lines-per-function
describe('Error Handler for forbiddenError', () => {

  it('happy path', async () => {
    const error = new ForbiddenError('message');
    const handler = new ErrorHandler();
    const code = handler.getHTTPCode(error);
    const message = handler.getHTTPMessage(error);
    const expected = 403;
    assert.equal(code, expected);
    assert.equal(message, 'Access restricted to this data');
  });
});
