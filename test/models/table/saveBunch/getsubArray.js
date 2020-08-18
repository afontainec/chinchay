/* global describe, before, it */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
// const knex = require('../../../../knex');
// const Table = require('../../../../models/table');
const Coffee = require('../../../../models/coffee-example');


const arrayToTest = [];
const len = 40000;

// eslint-disable-next-line max-lines-per-function
describe('MODEL TABLE: getSubArray unit', () => {
  before(async () => {
    for (let i = 0; i < len; i++) {
      arrayToTest.push({ id: 1 });
    }
  });

  it('happy path: no batchSize defined', async () => {
    const iterations = len / Coffee.INSERT_LIMIT_ARRAY;
    let reconstructed = [];
    for (let i = 0; i < iterations; i++) {
      reconstructed = reconstructed.concat(Coffee.getSubArray(arrayToTest, i));
    }
    assert.deepEqual(arrayToTest, reconstructed);
  });

  it('happy path: not the last part', async () => {
    const array = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const subArray = Coffee.getSubArray(array, 0, 3);
    const expected = ['a', 'b', 'c'];
    assert.deepEqual(subArray, expected);
  });

  it('happy patt: middle part', async () => {
    const array = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const subArray = Coffee.getSubArray(array, 1, 3);
    const expected = ['d', 'e', 'f'];
    assert.deepEqual(subArray, expected);
  });

  it('happy path: last part', async () => {
    const array = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const subArray = Coffee.getSubArray(array, 2, 3);
    const expected = ['g'];
    assert.deepEqual(subArray, expected);
  });
});
