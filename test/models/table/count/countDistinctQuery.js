/* global describe, it, before */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: countDistinctQuery', () => { // eslint-disable-line max-lines-per-function
  before(async () => {
    await knex.seed.run();
  });

  it('happy path', async () => {
    const results = await Coffee.countDistinctQuery({}, { countDistinct: 'price' });
    assert.deepEqual(results, [{ count: '3' }]);
  });

  it('With query', async () => {
    const results = await Coffee.countDistinctQuery({ price: ['is not', null] }, { countDistinct: 'price' });
    assert.deepEqual(results, [{ count: '2' }]);
  });

  it('options is undefined', () => {
    try {
      Coffee.countDistinctQuery({ price: ['is not', null] });
    } catch (err) {
      assert.equal(err.chinchayCode, 'missing_count_distinct');
    }
  });

  it('options.countDistinct is undefined', () => {
    try {
      Coffee.countDistinctQuery({ price: ['is not', null] }, {});
    } catch (err) {
      assert.equal(err.chinchayCode, 'missing_count_distinct');
    }
  });
});
