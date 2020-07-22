/* global it, before, describe */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');

const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: updateById', () => { // eslint-disable-line max-lines-per-function

  before(async () => {
    await knex.seed.run();
  });

  it('happy path', async () => {
    const values = { name: 'edited' };
    const result = await Coffee.updateById(1, values);
    assert.isNotArray(result);
    assert.equal(result.id, 1);
    assert.equal(result.name, 'edited');
    const entry = await Coffee.findById(1);
    assert.deepEqual(entry, result);
  });

  it('returnAsquery', async () => {
    const entry = { name: 'edited' };
    const result = Coffee.updateById(1, entry, { returnAsQuery: true });
    const query = result.toString();
    assert.isTrue(query.startsWith('update '), `'${query}' is not a psql query`);

  });

});
