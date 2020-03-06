/* global describe, it */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const Coffee = require('../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: parseToSend', () => { // eslint-disable-line max-lines-per-function

  it('Happy path', async () => {
    const entry = { test: 'testing' };
    const result = await Coffee.parseToSend(entry);
    assert.deepEqual(result, entry);
  });
});
