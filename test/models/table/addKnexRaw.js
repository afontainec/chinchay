// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../knex');
const Coffee = require('../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: add rawSELECT', () => { // eslint-disable-line

  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('it a string',  async () => { // eslint-disable-line
    const coffee = await Coffee.find({}, 'all', { rawSelect: 'EXTRACT(hour from created_at) as hour' });
    assert.equal(coffee.length, 4);
    for (let i = 0; i < coffee.length; i++) {
      const keys = Object.keys(coffee[i]);
      assert.isTrue(keys.indexOf('hour') > -1);
      assert.isTrue(keys.length > 1);
    }
  });

  it('it is not defined',  async () => { // eslint-disable-line
    const coffee = await Coffee.find({}, 'all');
    assert.equal(coffee.length, 4);
    for (let i = 0; i < coffee.length; i++) {
      const keys = Object.keys(coffee[i]);
      assert.isTrue(keys.indexOf('hour') === -1);
      assert.isTrue(keys.length > 1);
    }
  });

  it('it is an array',  async () => { // eslint-disable-line
    const coffee = await Coffee.find({}, 'all', { rawSelect: ['EXTRACT(hour from created_at AT TIME ZONE ?) as hour', '+03'] });
    assert.equal(coffee.length, 4);
    for (let i = 0; i < coffee.length; i++) {
      const keys = Object.keys(coffee[i]);
      assert.isTrue(keys.indexOf('hour') > -1);
      assert.isTrue(keys.length > 1);
    }
  });
});
