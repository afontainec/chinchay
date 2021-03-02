/* global describe, before, it */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: deleteById', () => { // eslint-disable-line max-lines-per-function
  before(async () => {
    await knex.seed.run();
  });

  it('With valid id', async () => {
    const all = await Coffee.count();
    const deleted = await Coffee.deleteById(1);
    const results = await Coffee.count();
    assert.equal(results, all - 1);
    assert.isNotArray(deleted);
    assert.equal(deleted.id, 1);
  });
  it('returnAsQuery', async () => {
    const query = Coffee.deleteById(1, { returnAsQuery: true });
    assert.equal(query.toString(), 'delete from "coffee" where "id" = 1 returning *');
  });

  describe('Malicious happy path', () => { // eslint-disable-line max-lines-per-function
    before(async () => {
      await knex.seed.run();
    });

    it('Invalid type', (done) => {
      Coffee.deleteById('invalid type').then(() => {
        done('SHOULD NOT GET HERE');
      }).catch(() => {
        done();
      });
    });

    it('id not provided', (done) => {
      Coffee.deleteById().then(() => {
        done('SHOULD NOT GET HERE');
      }).catch(() => {
        done();
      });
    });

    it('id not provided, and asked to returnAsQuery', (done) => {
      try {
        Coffee.deleteById(null, { returnAsQuery: true });
        done('SHOULD NOT GET HERE');
      } catch (error) {
        done();
      }
    });
  });
});
