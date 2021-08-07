/* global it, describe */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');

const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: copyObjectValues', () => { // eslint-disable-line max-lines-per-function

  it('no values', async () => {
    const values = null;
    const result = Coffee.copyObjectValues(values);
    assert.equal(result, null);
  });

  it('happy path', async () => {
    const knexStatement = Coffee.knex.raw('123');
    const values = { id: 10, priority: knexStatement };
    const result = Coffee.copyObjectValues(values);
    assert.deepEqual(result, { id: 10, priority: knexStatement });
  });
});
