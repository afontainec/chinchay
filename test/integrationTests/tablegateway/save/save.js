// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai'); // eslint-disable-line
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


const assert = chai.assert; //eslint-disable-line


// Our parent block
describe('TABLE GATEWAY: save', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('save instance', async () => { // eslint-disable-line
    const entry = {
      name: 'name',
      price: 120,
    };
    const saved = await Coffee.save(entry);
    const fromDB = await Coffee.findById(saved.id);
    assert.isDefined(fromDB);
    assert.equal(entry.name, fromDB.name);
    assert.equal(entry.price, fromDB.price);
    assert.instanceOf(fromDB.created_at, Date);
    assert.instanceOf(fromDB.updated_at, Date);
  });

  it('unexistant property', (done) => { // eslint-disable-line
    const entry = {
      name: 'name',
      price: 120,
      other: 'not exist',
    };
    Coffee.save(entry).then(() => {
      done(new Error('Should not get here'));
    }).catch(() => {
      done();
    });
  });
});
