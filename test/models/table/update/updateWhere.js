/* global it, before, describe */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');

const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: updateWhere', () => { // eslint-disable-line max-lines-per-function

  before(async () => {
    await knex.seed.run();
  });

  it('values are a copy', async () => {
    const values = { id: 1, price: 987 };
    const search = { id: 1 };
    const options = {};
    const result = await Coffee.updateWhere(search, values, options);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 1);
    assert.equal(result[0].price, 987);
    assert.deepEqual(values, { id: 1, price: 987 });
  });

  it('values has knex.raw', async () => {
    const values = { price: Coffee.knex.raw('CASE WHEN id = ? THEN ?? END', [1, 900]) };
    const search = { id: 1 };
    const options = {};
    const result = await Coffee.updateWhere(search, values, options);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 1);
    assert.equal(result[0].price, 900);
  });
});
