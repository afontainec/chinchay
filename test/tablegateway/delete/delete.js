// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai'); // eslint-disable-line
const knex = require('../../../knex');
const Places = require('../../../models/places-example');


const assert = chai.assert; //eslint-disable-line


// Our parent block
describe('TABLE GATEWAY: delete', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('With valid id', async () => { // eslint-disable-line
    const all = await Places.count();
    await Places.delete(1);
    const results = await Places.count();
    assert.equal(results, all - 1);
  });

  describe('Malicious happy path', () => { // eslint-disable-line
    before(async () => { // eslint-disable-line
      await knex.seed.run();
    });

    it('With undefined id', (done) => { // eslint-disable-line
      Places.delete().then(() => {
        done('SHOULD NOT GET HERE');
      }).catch(() => {
        done();
      });
    });

    it('There is no entry that matches that query', async () => { // eslint-disable-line
      const all = await Places.count();
      await Places.delete(-8);
      const results = await Places.count();
      assert.equal(results, all);
    });
  });

  describe('with advance queries', () => { // eslint-disable-line
    before(async () => { // eslint-disable-line
      await knex.seed.run();
    });

    it('delete lower than', async () => { // eslint-disable-line
      await Places.delete({
        daily_visits: ['<', 3000],
      });
      const results = await Places.count({
        daily_visits: ['<', 3000],
      });
      assert.equal(results, 0);
    });
  });
});
