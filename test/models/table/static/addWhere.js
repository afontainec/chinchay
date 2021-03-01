/* global it, describe */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const { Table } = require('../../../..');


// Our parent block
describe('TABLE GATEWAY: addWhere', () => { // eslint-disable-line max-lines-per-function

  it('add search', (done) => {
    const query = knex('test').select('column');
    const search = {
      first: 'c',
      key: [['a', 'or', 'b'], 'and', ['c', 'or', 'd']],
    };
    Table.addWhere(query, search, {});
    const expected = 'select "column" from "test" where "first" = \'c\' and (("key" = \'a\' or "key" = \'b\') and ("key" = \'c\' or "key" = \'d\'))';
    assert.equal(query.toString(), expected);
    done();
  });

  it('add rawWhere', (done) => {
    const query = knex('test').select('column');
    const search = {
      first: 'c',
    };
    Table.addWhere(query, search, { rawWhere: 'b is not null' });
    const expected = 'select "column" from "test" where "first" = \'c\' and b is not null';
    assert.equal(query.toString(), expected);
    done();
  });

  it('search is null', (done) => {
    const query = knex('test').select('column');
    Table.addWhere(query, null, {});
    const expected = 'select "column" from "test"';
    assert.equal(query.toString(), expected);
    done();
  });

  it('search is another than object', (done) => {
    const query = knex('test').select('column');
    Table.addWhere(query, 'search', {});
    const expected = 'select "column" from "test"';
    assert.equal(query.toString(), expected);
    done();
  });

  it('options is undefined', (done) => {
    const query = knex('test').select('column');
    Table.addWhere(query, 'search');
    const expected = 'select "column" from "test"';
    assert.equal(query.toString(), expected);
    done();
  });

});
