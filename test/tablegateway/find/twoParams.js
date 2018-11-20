// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai'); // eslint-disable-line
const knex = require('../../../knex');
const Places = require('../../../models/places-example');


const assert = chai.assert; //eslint-disable-line


// Our parent block
describe('TABLE GATEWAY: Do not pass columns: assumes columns are all ', () => { // eslint-disable-line

  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('', async () => { // eslint-disable-line
    const places = await Places.find({}, {
      rawWhere: 'daily_visits in (500, 2020)',
    });
    const completePlaces = await Places.find({}, 'all', {
      rawWhere: 'daily_visits in (500, 2020)',
    });

    assert.equal(places.length, completePlaces.length);
    assert.deepEqual(places, completePlaces);
  });
});
