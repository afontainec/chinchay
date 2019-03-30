// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai'); // eslint-disable-line
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');
const Utils = require('codemaster').utils;

const assert = chai.assert; //eslint-disable-line


// Our parent block
describe('TABLE GATEWAY: filter attributes', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('filter attributes', async () => { // eslint-disable-line
    const raw = {
      id: 1,
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      name: 'yes',
    };
    const entry = Utils.cloneJSON(raw);
    const filtered = await Coffee.filterAttributes(entry);
    assert.deepEqual(raw, filtered);
  });

  it('unexistant attribute', (done) => { // eslint-disable-line
    const raw = {
      id: 1,
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      nonExistant: 'no',
    };
    Coffee.filterAttributes(raw).then(() => {
      done(new Error('Should not get here'));
    }).catch(() => {
      done();
    });
  });


  it('Get instance', (done) => { // eslint-disable-line
    Coffee.filterAttributes('this is not valid').then(() => {
      done(new Error('Should not get here'));
    }).catch(() => {
      done();
    });
  });
});
