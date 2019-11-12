// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');

// NOTE Access hace algo raro, arreglar
// NOTE hay algunos que pasan un arreglo de columnas, para queries mas complejas
// NOTE Ver tambien como hacer funcionar los accessibleBy.


// Our parent block
describe('TABLE GATEWAY: COUNT WITH COMPLEX WHERE', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('Query with array: >=', async () => { // eslint-disable-line
    const q = { price: 100 };
    const date = new Date('2018-11-21T12:06:10.065Z');
    q.created_at = ['<=', date];
    const results = await Coffee.count(q);
    assert.equal(results, 2);
  });

  it('Query with array: in', async () => { // eslint-disable-line
    const q = {};
    const ids = [1, 4];
    q.id = ['in', ids];
    const results = await Coffee.count(q);
    delete q.id;
    assert.equal(results, 2);
  });

  it('Query with array: <>', async () => { // eslint-disable-line
    const q = {};
    const id = 3;
    q.id = ['<>', id];
    const results = await Coffee.count(q);
    assert.equal(results, 3);
  });
});
