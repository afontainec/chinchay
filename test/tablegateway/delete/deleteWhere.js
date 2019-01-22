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

  it('With query', async () => { // eslint-disable-line
    const results = await Places.deleteWhere({ daily_visits: 500 });
    assert.equal(results.length, 1);
  });

  it('Empty query: Should delete all', async () => { // eslint-disable-line
    const results = await Places.deleteWhere({});
    assert.equal(results.length, 3);
  });

  describe('Malicious happy path', () => { // eslint-disable-line
    before(async () => { // eslint-disable-line
      await knex.seed.run();
    });

    it('unexistant key',  (done) => { // eslint-disable-line
      Places.deleteWhere({ unexistant: 500 }).then(() => {
        done('SHOULD NOT GET HERE');
      }).catch(() => {
        done();
      });
    });

    it('There is no entry that matches that query',  (done) => { // eslint-disable-line
      Places.deleteWhere({ daily_visits: -500 }).then(() => {
        done('SHOULD NOT GET HERE');
      }).catch(() => {
        Places.count().then((results) => {
          assert.equal(results, 4);
          done();
        }).catch((err) => {
          done(err);
        });
      });
    });
  });

  describe('with advance queries', () => { // eslint-disable-line
    before(async () => { // eslint-disable-line
      await knex.seed.run();
    });

    it('delete lower than', async () => { // eslint-disable-line
      throw new Error('NOT IMPLEMENTED');
    });
  });
});
