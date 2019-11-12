// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: Do not pass columns: assumes columns are all ', () => { // eslint-disable-line

  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('', async () => { // eslint-disable-line
    const coffee = await Coffee.find({}, {
      rawWhere: 'price in (100, 105)',
    });
    const completeCoffee = await Coffee.find({}, 'all', {
      rawWhere: 'price in (100, 105)',
    });

    assert.equal(coffee.length, completeCoffee.length);
    assert.deepEqual(coffee, completeCoffee);
  });
});
