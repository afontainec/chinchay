// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai'); // eslint-disable-line
const knex = require('../../../knex');
const Places = require('../../../models/places-example');


const assert = chai.assert; //eslint-disable-line


// Our parent block
describe('TABLE GATEWAY: FIND BY ID', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('Existing id', async () => { // eslint-disable-line
    const results = await Places.findById(1);
    assert.equal(typeof results, 'object');
    assert.equal(results.id, 1);
  });

  it('non exiting id',  (done) => { // eslint-disable-line
    Places.findById(-1).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage, 'unexistantID');
      done();
    });
  });

  it('Not valid id ', (done) => { // eslint-disable-line
    Places.findById('what is this').then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage, 'pg_atoi');
      done();
    });
  });
});
