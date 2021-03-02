/* global it, describe */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const { Table } = require('../../../..');


// Our parent block
describe('TABLE GATEWAY: insertWhere', () => { // eslint-disable-line max-lines-per-function

  it('it is composed', (done) => {
    const query = knex('test').select('column').where('first', 'c');
    Table.insertWhere(query, 'key', ['a', 'or', 'b']);
    const expected = 'select "column" from "test" where "first" = \'c\' and ("key" = \'a\' or "key" = \'b\')';
    assert.equal(query.toString(), expected);
    done();
  });

  it('it isn\'t an array', (done) => {
    const query = knex('test').select('column').where('first', 'c');
    Table.insertWhere(query, 'key', 'b');
    const expected = 'select "column" from "test" where "first" = \'c\' and "key" = \'b\'';
    assert.equal(query.toString(), expected);
    done();
  });

  it('it is special', (done) => {
    const query = knex('test').select('column').where('first', 'c');
    Table.insertWhere(query, 'key', ['<>', 'b']);
    const expected = 'select "column" from "test" where "first" = \'c\' and "key" <> \'b\'';
    assert.equal(query.toString(), expected);
    done();
  });

  it('The value is null', (done) => {
    const query = knex('test').select('column').where('first', 'c');
    Table.insertWhere(query, 'key', null);
    const expected = 'select "column" from "test" where "first" = \'c\' and "key" is null';
    assert.equal(query.toString(), expected);
    done();
  });

});
