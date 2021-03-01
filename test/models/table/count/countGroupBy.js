/* global describe, it, before */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: countGroupBy', () => { // eslint-disable-line
  before(async () => {
    await knex.seed.run();
  });

  it('happy path', async () => {
    const results = await Coffee.countGroupBy('price', { name: 'expensive' });
    const expected = [
      { price: 110, count: 1 },
    ];
    assert.deepEqual(results, expected);
  });

  it('options is defined', async () => {
    const results = await Coffee.countGroupBy('price', {}, { orderBy: ['price', 'desc'] });
    const expected = [
      { price: null, count: 1 },
      { price: 110, count: 1 },
      { price: 100, count: 2 },
    ];
    assert.deepEqual(results, expected);
  });

});
