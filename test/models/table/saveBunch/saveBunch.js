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
    // console.log(arrayToTest);
    await Coffee.saveBunch(arrayToTest);
    const saved = await Coffee.find();
    console.log(saved.length);
    // assert.deepEqual(arrayToTest, outcome);

  });
});
