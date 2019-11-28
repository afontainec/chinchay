// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
// const knex = require('../../../../knex');
// const Table = require('../../../../models/table');
const Coffee = require('../../../../models/coffee-example');


const arrayToTest = [];
const len = 40000;

// Our parent block
describe('MODEL TABLE: getSubArray unit', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    for (let i = 0; i < len; i++) {
      arrayToTest.push({ id: 1 });
    }
  });

  it('hapry path', async () => { // eslint-disable-line
    const iterations = len / Coffee.INSERT_LIMIT_ARRAY;
    const subArrayArray = [];
    for (let i = 0; i < iterations; i++) {
      subArrayArray.push(Coffee.getSubArray(i, iterations, arrayToTest));
    }
    const outcome = [];
    for (let i = 0; i < subArrayArray.length; i++) {
      for (let j = 0; j < subArrayArray[i].length; j++) {
        outcome.push(subArrayArray[i][j]);
      }
    }
    assert.deepEqual(arrayToTest, outcome);
  });
});
