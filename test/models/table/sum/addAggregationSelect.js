/* global describe, it */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Table = require('../../../../models/table');


// Our parent block
describe('TABLE GATEWAY: AddAggregationSelect', () => { // eslint-disable-line max-lines-per-function

  it('options is undef', (done) => {
    try {
      const query = knex('coffee');
      Table.addAggregateSelect(query, 'amount');
      done('SHOULD HAVE RETURNED AN ERROR');
    } catch (error) {
      done();
    }
  });

  it('happy path', (done) => {
    const query = knex('coffee');
    const options = {
      aggregation: 'sum',
    };
    Table.addAggregateSelect(query, 'amount', options);
    const expected = 'select sum("amount") from "coffee"';
    assert.equal(query.toString(), expected);
    done();
  });

  it('has raw select', (done) => {
    const query = knex('coffee');
    const options = {
      rawSelect: 'name as type',
      aggregation: 'sum',
    };
    Table.addAggregateSelect(query, 'amount', options);
    const expected = 'select name as type, sum("amount") from "coffee"';
    assert.equal(query.toString(), expected);
    done();
  });

  it('happy path', (done) => {
    const query = knex('coffee');
    const options = { aggregation: 'sum' };
    Table.addAggregateSelect(query, 'amount', options);
    const expected = 'select sum("amount") from "coffee"';
    assert.equal(query.toString(), expected);
    done();
  });

  it('column is undefined', (done) => {
    try {
      const query = knex('coffee');
      const options = { };
      Table.addAggregateSelect(query, null, options);
      done('SHOULD HAVE RETURNED AN ERROR');
    } catch (error) {
      done();
    }
  });
});
