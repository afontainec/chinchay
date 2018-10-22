// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const knex = require('../../../../db/knex');
const Places = require('../../../../services/models/tableGateway/example/places');

// NOTE Access hace algo raro, arreglar
// NOTE hay algunos que pasan un arreglo de columnas, para queries mas complejas
// NOTE Ver tambien como hacer funcionar los accessibleBy.


const assert = chai.assert; //eslint-disable-line


// Our parent block
describe('TABLE GATEWAY: FIND WITH COMPLEX WHERE', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('Query with array: >=', async () => { // eslint-disable-line
    const q = { is_active: true };
    const date = new Date(new Date().getTime() - (3 * 24 * 60 * 60 * 1000));
    q.created_at = ['>=', date];
    const results = await Places.count(q);
    assert.equal(results, 2);
  });

  it('Query with array: in', async () => { // eslint-disable-line
    const q = {};
    const ids = [1, 4];
    q.id = ['in', ids];
    const results = await Places.count(q);
    delete q.id;
    assert.equal(results, 2);
  });

  it('Query with array: <>', async () => { // eslint-disable-line
    const q = {};
    const id = 3;
    q.id = ['<>', id];
    const results = await Places.count(q);
    assert.equal(results, 3);
  });
});
