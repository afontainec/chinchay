/* global describe, before, it */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


const arrayToTest = [];
const len = 40000;

// Our parent block
describe('TABLE saveBunch: integration', () => { // eslint-disable-line max-lines-per-function
  before(async () => {
    await knex('coffee').del();
    for (let i = 0; i < len; i++) {
      arrayToTest.push({
        name: `${i}`,
        price: i,
      });
    }
  });

  it('save a array', async () => {
    const result = await Coffee.saveBunch([...arrayToTest]);
    const saved = await knex('coffee').select('*').orderBy('price');
    assert.deepEqual(result, saved);
    for (let i = 0; i < saved.length; i++) {
      delete saved[i].id;
    }
    assert.deepEqual(arrayToTest, saved);
  });

  it('batch size: all saved correctly', async () => {
    await knex('coffee').del();
    const result = await Coffee.saveBunch([...arrayToTest], 150);
    const saved = await knex('coffee').select('*').orderBy('price');
    assert.deepEqual(result, saved);
    for (let i = 0; i < saved.length; i++) {
      delete saved[i].id;
    }
    assert.deepEqual(arrayToTest, saved);
  });
});
