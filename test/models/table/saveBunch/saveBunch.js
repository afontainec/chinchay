// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


const arrayToTest = [];
const len = 40000;

// Our parent block
describe('TABLE saveBunch: integration', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex('coffee').del();
    for (let i = 0; i < len; i++) {
      arrayToTest.push({
        name: `${i}`,
        price: i,
      });
    }
  });

  it('save a array', async () => { // eslint-disable-line
    await Coffee.saveBunch([...arrayToTest]);
    const saved = await knex('coffee').select('*').orderBy('price');
    for (let i = 0; i < saved.length; i++) {
      delete saved[i].id;
    }
    assert.deepEqual(arrayToTest, saved);
  });
});
