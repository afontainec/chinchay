// During the test the env variable is set to test
/* global it, describe */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const { ChinchayError } = require('../../../');


// Our parent block
// eslint-disable-next-line max-lines-per-function
describe('ChinchayError', () => {

  it('error is string', async () => {
    const error = new ChinchayError('this is the error');
    assert.equal(error.name, 'Error');
    assert.equal(error.message, 'Error: this is the error');
    assert.equal(error.chinchayMessage, 'this is the error');
  });

  it('error is object', async () => {
    const error = new ChinchayError(new Error('this is the error'));
    assert.equal(error.name, 'Error');
    assert.equal(error.message, 'Error: this is the error');
    assert.equal(error.chinchayMessage, 'this is the error');
  });

  it('pass chinchayCode', async () => {
    const error = new ChinchayError(new Error('this is the error'), 'code');
    assert.equal(error.chinchayCode, 'code');
  });

  it('pass chinchayMessage', async () => {
    const error = new ChinchayError(new Error('this is the error'), 'code', 'custom message');
    assert.equal(error.chinchayMessage, 'custom message');
  });
});
