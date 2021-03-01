/* global it, describe */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const { Table } = require('../../../..');


// Our parent block
describe('TABLE GATEWAY: isComposed', () => { // eslint-disable-line max-lines-per-function

  it('happy path', (done) => {
    const query = knex('test').select('column').where('first', 'c');
    Table.insertSpecial(query, 'key', 'b');
    const expected = 'select "column" from "test" where "first" = \'c\' and "key" = \'b\'';
    assert.equal(query.toString(), expected);
    done();
  });

  it('operator is or', (done) => {
    const query = knex('test').select('column').where('first', 'c');
    Table.insertSpecial(query, 'key', 'b', 'or');
    const expected = 'select "column" from "test" where "first" = \'c\' or "key" = \'b\'';
    assert.equal(query.toString(), expected);
    done();
  });

});
