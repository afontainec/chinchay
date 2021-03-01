/* global describe, it, before */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: countIn', () => { // eslint-disable-line
  before(async () => {
    await knex.seed.run();
  });

  it('validOptions is not array', async () => {
    const results = await Coffee.countIn('price', 110);
    assert.equal(results, '1');
  });

  it('validOptions is array', async () => {
    const results = await Coffee.countIn('price', [110, 100]);
    assert.equal(results, '3');
  });

  it('hasQuery', async () => {
    const results = await Coffee.countIn('price', [110, 100], { name: 'expensive' });
    assert.equal(results, '1');
  });
});
