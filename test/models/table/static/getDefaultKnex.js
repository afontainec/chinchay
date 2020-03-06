/* global describe, it, after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const otherKnex = require('../../../../otherKnex');
const { Table } = require('../../../../');


// Our parent block
describe('TABLE GATEWAY: get and set DefaultKnex', () => { // eslint-disable-line max-lines-per-function

  // set knex back to what it was
  after(() => {
    Table.setDefaultKnex(knex);
  });

  it('By Default: chainfile defined', (done) => {
    const result = Table.getDefaultKnex();
    assert.deepEqual(result, knex);
    done();
  });

  it('Set default knex', (done) => {
    Table.setDefaultKnex(otherKnex);
    const result = Table.getDefaultKnex();
    assert.deepEqual(otherKnex, result);
    done();
  });


  it('From not present', (done) => {
    const instance = new Table('instance');
    const result = instance.getKnex();
    assert.deepEqual(otherKnex, result);
    done();
  });
});
