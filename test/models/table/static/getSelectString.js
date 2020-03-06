/* global describe, it */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const { Table } = require('../../../..');


// Our parent block
describe('TABLE GATEWAY: geSelectString', () => { // eslint-disable-line max-lines-per-function

  it('Happy path', (done) => {
    const query = knex.raw('select id, name from table');
    const expected = ' id, name ';
    const select = Table.getSelectString(query);
    assert.equal(expected, select);
    done();
  });

  it('With parenthesis', (done) => {
    const query = knex.raw('select id, (select name from other) from table');
    const expected = ' id, (select name from other) ';
    const select = Table.getSelectString(query);
    assert.equal(expected, select);
    done();
  });


  it('From not present', (done) => {
    const query = knex.raw('select id, (select name from other)');
    const expected = 'Query badly parsed';
    const select = Table.getSelectString(query);
    assert.equal(expected, select);
    done();
  });
});
