// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: FIND WITH COMPLEX WHERE', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('Query with array: >=', async () => { // eslint-disable-line
    const q = { price: 100 };
    const date = new Date('2018-11-21T11:55:04.065Z');
    q.created_at = ['>=', date];
    const results = await Coffee.find(q);
    assert.equal(results.length, 1);
    for (let i = 0; i < results.length; i++) {
      const created = new Date(results[i].created_at);
      assert.isTrue(created >= date);
    }
  });

  it('Query with array: in', async () => { // eslint-disable-line
    const q = {};
    const ids = [1, 4];
    q.id = ['in', ids];
    const results = await Coffee.find(q);
    delete q.id;
    assert.equal(results.length, 2);
    for (let i = 0; i < results.length; i++) {
      assert.isTrue(ids.indexOf(results[i].id) >= 0);
    }
  });

  it('Query with array: <>', async () => { // eslint-disable-line
    const q = {};
    const id = 3;
    q.id = ['<>', id];
    const results = await Coffee.find(q);
    assert.equal(results.length, 3);
    for (let i = 0; i < results.length; i++) {
      assert.isFalse(results[i].id === id);
    }
  });
});

describe('Malicious', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  // only the first two are used
  it('Query has more than 2 elements in array', async () => { // eslint-disable-line
    const q = {};
    const id = 3;
    q.id = ['<>', id, 'something else'];
    const results = await Coffee.find(q);
    assert.equal(results.length, 3);
    for (let i = 0; i < results.length; i++) {
      assert.isFalse(results[i].id === id);
    }
  });

  // is ignored
  it('Query has less than 2 elements in array', async () => { // eslint-disable-line
    const q = {};
    q.id = ['<>'];
    const results = await Coffee.find(q);
    assert.equal(results.length, 4);
  });

  // is ignored
  it('Query invalid sintax', (done) => { // eslint-disable-line
    const q = {};
    const id = 3;
    q.id = [id, 'something else'];
    Coffee.find(q).then(() => {
      done('it should not get here');
    }).catch(() => {
      done();
    });
  });
});
