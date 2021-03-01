/* global it, describe */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const { Table } = require('../../../..');


// Our parent block
describe('TABLE GATEWAY: insertComposed', () => { // eslint-disable-line max-lines-per-function

  it('happy path', (done) => {
    const query = knex('test').select('column').where('first', 'c');
    Table.insertComposed(query, 'key', ['a', 'or', 'b']);
    const expected = 'select "column" from "test" where "first" = \'c\' and ("key" = \'a\' or "key" = \'b\')';
    assert.equal(query.toString(), expected);
    done();
  });

  it('has very complex queries', (done) => {
    const query = knex('test').select('column').where('first', 'c');
    Table.insertComposed(query, 'key', [['a', 'or', 'b'], 'and', ['c', 'or', 'd']]);
    const expected = 'select "column" from "test" where "first" = \'c\' and (("key" = \'a\' or "key" = \'b\') and ("key" = \'c\' or "key" = \'d\'))';
    assert.equal(query.toString(), expected);
    done();
  });

});
