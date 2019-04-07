// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');
const Table = require('../../../../models/table');


// Our parent block
describe('TABLE GATEWAY: new', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('Get instance', async () => { // eslint-disable-line
    const entry = await Coffee.new();
    const expected = {
      id: null,
      name: null,
      price: null,
      created_at: null,
      updated_at: null,
    };
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
