// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: ArrayOfIds', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('happy path', async () => { // eslint-disable-line
    const results = await coffee.arrayOfIds();
    const expected = [1, 2, 3, 4];
    results.sort();
    assert.isArray(results);
    assert.deepEqual(results, expected);
  });

  it('empty response', async () => { // eslint-disable-line
    const results = await coffee.arrayOfIds({ name: 'nonexistant' });
    const expected = [];
    results.sort();
    assert.isArray(results);
    assert.deepEqual(results, expected);
  });
});
