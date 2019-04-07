// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');
const Table = require('../../../../models/table');


// Our parent block
describe('TABLE GATEWAY: get attributes names', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('Get attributes', async () => { // eslint-disable-line
    const entry = await Coffee.getAttributesNames();
    const expected = ['id', 'name', 'price', 'created_at', 'updated_at'];
    assert.deepEqual(entry, expected);
  });

  describe('unexistant table', () => { // eslint-disable-line
    before(async () => { // eslint-disable-line
      await knex.seed.run();
    });

    it('Get instance', (done) => { // eslint-disable-line
      const tableName = 'does_not_exist';
      const Unexistant = new Table(tableName);
      Unexistant.new().then(() => {
        done(new Error('Should not get here'));
      }).catch(() => {
        done();
      });
    });
  });
});
