// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: delete', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('With query', async () => { // eslint-disable-line
    const results = await Coffee.deleteWhere({
      price: 110,
    });
    assert.equal(results.length, 1);
  });

  it('Empty query: Should delete all', async () => { // eslint-disable-line
    const results = await Coffee.deleteWhere({});
    assert.equal(results.length, 3);
  });

  describe('Malicious happy path', () => { // eslint-disable-line
    before(async () => { // eslint-disable-line
      await knex.seed.run();
    });

    it('unexistant key', (done) => { // eslint-disable-line
      Coffee.deleteWhere({
        unexistant: 500,
      }).then(() => {
        done('SHOULD NOT GET HERE');
      }).catch(() => {
        done();
      });
    });

    it('There is no entry that matches that query', async () => { // eslint-disable-line
      const all = await Coffee.count();
      await Coffee.deleteWhere({
        price: -500,
      });
      const results = await Coffee.count();
      assert.equal(results, all);
    });
  });

  describe('with advance queries', () => { // eslint-disable-line
    before(async () => { // eslint-disable-line
      await knex.seed.run();
    });

    it('delete lower than', async () => { // eslint-disable-line
      await Coffee.delete({
        price: ['<', 105],
      });
      const results = await Coffee.count({
        price: ['<', 105],
      });
      assert.equal(results, 0);
    });
  });
});
