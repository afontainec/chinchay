// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
// const knex = require('../../../../knex');
const Table = require('../../../../models/table');
// const Coffee = require('../../../../models/coffee-example');


const arrayToTest = [
  {
    id: 1,
    prop: 'prop',
    created_at: new Date(),
    updated_at: new Date(),
  }, {
    id: 2,
    prop: 'prop',
    created_at: new Date(),
    updated_at: new Date(),
  }, {
    id: 3,
    prop: 'prop',
    created_at: new Date(),
    updated_at: new Date(),
  },
];


// Our parent block
describe('MODEL TABLE: parseForSaveArray integration test', () => { // eslint-disable-line

  it('hapry path', async () => { // eslint-disable-line
    const parsed = Table.parseForSaveArray(arrayToTest);
    for (let i = 0; i < parsed.length; i++) {
      assert.isUndefined(parsed[i].id);
      assert.isDefined(parsed[i].created_at);
      assert.isDefined(parsed[i].updated_at);
      assert.equal(parsed[i].prop, 'prop');
    }
  });
  it('when undefined input', async () => { // eslint-disable-line
    const parsed = Table.parseForSaveArray();
    assert.deepEqual(parsed, []);
  });
});
