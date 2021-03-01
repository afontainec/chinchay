/* global describe, it, before */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: min', () => { // eslint-disable-line max-lines-per-function

  before(async () => {
    await knex.seed.run();
  });

  it('happy path', async () => {
    const column = 'price';
    const search = { price: ['>', 90] };
    const options = { };
    const result = await Coffee.min(column, search, options);
    assert.equal(result, 100);
  });
});
