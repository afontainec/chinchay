// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: FIND ID IN', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('Existing ids', async () => { // eslint-disable-line
    const ids = [1, 2];
    const results = await Coffee.findIdIn(ids);
    assert.equal(results.length, 2);
    for (let i = 0; i < results.length; i++) {
      assert.isTrue(ids.indexOf(results[i].id) > -1);
    }
  });

  it('Existing ids with columns and query',  async () => { // eslint-disable-line
    const ids = [1, 2, 3, 4];
    const results = await Coffee.findIdIn(ids, ['id', 'name', 'price'], { price: 100 });
    assert.equal(results.length, 2);
    for (let i = 0; i < results.length; i++) {
      assert.equal(results[i].price, 100);
      assert.equal(Object.keys(results[i]).length, 3);
      assert.isTrue(ids.indexOf(results[i].id) > -1);
    }
  });

  it('Malicious: a given id', async () => { // eslint-disable-line
    const ids = 1;
    const results = await Coffee.findIdIn(ids);
    assert.equal(results.length, 1);
    assert.equal(results[0].id, ids);
  });

  it('Malicious: array of string', (done) => { // eslint-disable-line
    Coffee.findIdIn(['does not exist']).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage.routine, 'pg_atoi');
      done();
    });
  });

  it('Malicious: not valid id', (done) => { // eslint-disable-line
    Coffee.findIdIn('wabalaba').then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage.routine, 'pg_atoi');
      done();
    });
  });
});
