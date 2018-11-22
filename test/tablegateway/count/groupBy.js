// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai'); // eslint-disable-line
const knex = require('../../../knex');
const Places = require('../../../models/places-example');

// NOTE Access hace algo raro, arreglar
// NOTE hay algunos que pasan un arreglo de columnas, para queries mas complejas
// NOTE Ver tambien como hacer funcionar los accessibleBy.


const assert = chai.assert; //eslint-disable-line


// Our parent block
describe('TABLE GATEWAY: COUNT WITH groupBy', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('Standart groupBy', async () => { // eslint-disable-line
    const query = {};
    const opt = { groupBy: 'daily_visits' };
    const results = await Places.count(query, opt);
    assert.equal(results.length, 3);
    for (let i = 0; i < results.length; i++) {
      assert.isNotNull(results[i], 'daily_visits');
      assert.isNotNull(results[i], 'count');
    }
  });

  it('Group By, returns only one result', async () => { // eslint-disable-line
    const query = { is_active: false };
    const opt = { groupBy: 'daily_visits' };
    const results = await Places.count(query, opt);
    assert.equal(results.length, 1);
    assert.isNotNull(results[0], 'daily_visits');
    assert.isNotNull(results[0], 'count');
  });
});
