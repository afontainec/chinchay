// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: filter columns', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('remove unexistant columns', async () => { // eslint-disable-line
    const entry = ['price', 'name', 'get out'];
    const filtered = await Coffee.filterColumns(entry);
    assert.isArray(filtered);
    assert.equal(filtered.length, 2);
    assert.isTrue(filtered.indexOf('price') > -1);
    assert.isTrue(filtered.indexOf('name') > -1);
  });

  it('input is not an array', async () => { // eslint-disable-line
    const filtered = await Coffee.filterColumns('entry');
    assert.deepEqual(filtered, []);
  });
});
