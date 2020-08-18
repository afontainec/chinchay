// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


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

  it('non-existant property', (done) => { // eslint-disable-line
    const entry = {
      name: 'name',
      price: 120,
      other: 'not exist',
    };
    Coffee.save(entry).then(() => {
      done(new Error('Should not get here'));
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.message, 'Intentando de agregar columna inexistent');
      done();
    });
  });
});

describe('TABLE save: when a input is an Array', () => { // eslint-disable-line

  const arrayToTest = [];
  const len = 40000;

  before(async () => { // eslint-disable-line no-undef
    await knex('coffee').del();
    for (let i = 0; i < len; i++) {
      arrayToTest.push({
        name: `${i}`,
        price: i,
      });
    }
  });

  it('save a array', async () => { // eslint-disable-line
    await Coffee.save(arrayToTest);

    const saved = await knex('coffee').select('*').orderBy('price');
    for (let i = 0; i < saved.length; i++) {
      delete saved[i].id;
      delete saved[i].created_at;
      delete saved[i].updated_at;
    }
    assert.deepEqual(arrayToTest, saved);
  });

  it('save a array: with batchSize', async () => { // eslint-disable-line
    await Coffee.delete({});
    await Coffee.save(arrayToTest, 400);
    const saved = await knex('coffee').select('*').orderBy('price');
    for (let i = 0; i < saved.length; i++) {
      delete saved[i].id;
      delete saved[i].created_at;
      delete saved[i].updated_at;
    }
    assert.deepEqual(arrayToTest, saved);
  });
});
