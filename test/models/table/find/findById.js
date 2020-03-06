// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: FIND BY ID', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('Existing id', async () => { // eslint-disable-line
    const results = await coffee.findById(1);
    assert.equal(typeof results, 'object');
    assert.equal(results.id, 1);
  });

  it('non exiting id',  (done) => { // eslint-disable-line
    coffee.findById(-1).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 500);
      assert.equal(err.fullMessage.chinchayCode, 'unexistantID');
      done();
    });
  });

  it('Not valid id ', (done) => { // eslint-disable-line
    coffee.findById('what is this').then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage.routine, 'pg_atoi');
      done();
    });
  });
});
