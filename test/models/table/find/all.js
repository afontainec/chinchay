/* global describe, it, before */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const codemaster = require('codemaster');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
// eslint-disable-next-line max-lines-per-function
describe('TABLE GATEWAY: FIND', () => {
  before(async () => {
    await knex.seed.run();
  });

  it('Happy path', async () => {
    const results = await Coffee.all(['name']);
    assert.equal(results.length, 4);
    assert.deepEqual(Object.keys(results[0]), ['name']);
  });


  it('With options', async () => {
    const results = await Coffee.all('all', { orderBy: ['created_at', 'desc'] });
    const ordered = codemaster.utils.cloneObject(results);
    ordered.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    results.forEach((element) => {
      delete element.created_at;
      delete element.updated_at;
    });
    ordered.forEach((element) => {
      delete element.created_at;
      delete element.updated_at;
    });
    assert.deepEqual(results, ordered);
  });

  it('With columns = all', async () => {
    const results = await Coffee.find({}, 'all');
    assert.equal(results.length, 4);
    for (let i = 0; i < results.length; i++) {
      const keys = Object.keys(results[i]);
      assert.equal(keys.length, 5);
    }
  });

});
