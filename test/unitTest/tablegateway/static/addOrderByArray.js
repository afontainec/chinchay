// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const { Table } = require('../../../..');
const knex = require('../../../../knex');


// Our parent block
describe('TABLE GATEWAY: add groupByArray', () => { // eslint-disable-line

  it('is undef ',  (done) => { // eslint-disable-line
    let query = knex('table');
    query = Table.addOrderByArray(query);
    const expected = 'select * from "table"';
    assert.equal(expected, query.toString());
    done();
  });

  it('is not array ',  (done) => { // eslint-disable-line
    let query = knex('table');
    query = Table.addOrderByArray(query, 'first');
    const expected = 'select * from "table" order by "first" asc';
    assert.equal(expected, query.toString());
    done();
  });

  it('is array of length 2 without inner arrays ',  (done) => { // eslint-disable-line
    let query = knex('table');
    query = Table.addOrderByArray(query, ['first', 'asc']);
    const expected = 'select * from "table" order by "first" asc';
    assert.equal(expected, query.toString());
    done();
  });

  it('is array without inner arrays with length more than 2 ',  (done) => { // eslint-disable-line
    let query = knex('table');
    query = Table.addOrderByArray(query, ['first', 'asc', 'second', 'desc', 'third']);
    const expected = 'select * from "table" order by "first" asc, "second" desc, "third" asc';
    assert.equal(expected, query.toString());
    done();
  });

  it('is array with inner arrays',  (done) => { // eslint-disable-line
    let query = knex('table');
    query = Table.addOrderByArray(query, [['first', 'asc'], ['second'], ['third', 'desc']]);
    const expected = 'select * from "table" order by "first" asc, "second" asc, "third" desc';
    assert.equal(expected, query.toString());
    done();
  });

  it('is array with inner arrays but last one is not array',  (done) => { // eslint-disable-line
    let query = knex('table');
    query = Table.addOrderByArray(query, [['first', 'asc'], ['second', 'desc'], 'third']);
    const expected = 'select * from "table" order by "first" asc, "second" desc, "third" asc';
    assert.equal(expected, query.toString());
    done();
  });
});
