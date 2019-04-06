// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const { Table } = require('../../../..');


// Our parent block
describe('TABLE GATEWAY: count', () => { // eslint-disable-line

  it('it the only one',  (done) => { // eslint-disable-line
    const column = 'name';
    const query = knex('coffee').select(column).where('some_key', 'some_value');
    assert.isTrue(Table.hasColumnInSelect(query, column));
    done();
  });

  it('has several parenthesis',  (done) => { // eslint-disable-line
    const column = 'doy';
    const query = knex('coffee').select(knex.raw('EXTRACT(doy from created_at) as doy, EXTRACT(year from created_at) as year')).where('some_key', 'some_value');
    assert.isTrue(Table.hasColumnInSelect(query, column));
    done();
  });

  it('not present: given columns',  (done) => { // eslint-disable-line
    const column = 'name';
    const query = knex('coffee').select(column).where('some_key', 'some_value');
    assert.isFalse(Table.hasColumnInSelect(query, 'other'));
    done();
  });
});
