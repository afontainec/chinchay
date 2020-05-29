// During the test the env variable is set to test
/* global it, describe */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const ChinchayError = require('../../../models/chinchayError');


// Our parent block
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
});
