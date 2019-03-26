// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai'); // eslint-disable-line
const knex = require('../../knex');
const Coffee = require('../../models/coffee-example');


const assert = chai.assert; //eslint-disable-line


// Our parent block
describe('TABLE GATEWAY: add rawWhere', () => { // eslint-disable-line

  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('it a string',  async () => { // eslint-disable-line
    const coffee = await Coffee.find({}, 'all', { rawWhere: 'daily_visits in (500, 2020)' });
    assert.equal(coffee.length, 3);
    for (let i = 0; i < coffee.length; i++) {
      assert.isTrue([500, 2020].indexOf(coffee[i].daily_visits) > -1);
    }
  });

  it('it is not defined',  async () => { // eslint-disable-line
    const coffee = await Coffee.find({}, 'all');
    assert.equal(coffee.length, 4);
  });

  it('it is an array',  async () => { // eslint-disable-line
    const coffee = await Coffee.find({}, 'all', { rawWhere: ['daily_visits = ANY(?::int[])', [[500, 2020]]] });
    assert.equal(coffee.length, 3);
    for (let i = 0; i < coffee.length; i++) {
      assert.isTrue([500, 2020].indexOf(coffee[i].daily_visits) > -1);
    }
  });
});
