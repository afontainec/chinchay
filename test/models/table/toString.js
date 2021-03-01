/* global describe, it */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const Coffee = require('../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: countGroupBy', () => { // eslint-disable-line

  it('happy path', async () => {
    assert.equal(Coffee.toString(), 'coffee');
  });


});
