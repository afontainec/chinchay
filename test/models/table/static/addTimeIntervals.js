/* global describe, it */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const { Table } = require('../../../..');
const Coffee = require('../../../../models/coffee-example');
const knex = require('../../../../knex');

class TestClass extends Table {
  constructor() {
    const tableName = 'coffee';
    super(tableName);
  }

  static addTimeInterval(query, options) {
    if (options.skipTimezone) return Table.addTimeInterval(query, options);
    if (options.endDate) query.andWhere(knex.raw('("created_at" at time zone timezone)'), '<', options.endDate);
    if (options.startDate) query.andWhere(knex.raw('("created_at" at time zone timezone)'), '>', options.startDate);
    return query;
  }
}
// Our parent block
describe('TABLE GATEWAY: add timestamps', () => { // eslint-disable-line max-lines-per-function

  it('startDate is defined ', (done) => {
    const query = Coffee.find({ id: 1 }, 'all', { returnAsQuery: true });
    Table.addTimeInterval(query, '2020-01-01');
    const expected = 'select * from "coffee" where "id" = 1 and "created_at" > \'2020-01-01\'';
    assert.equal(query.toString(), expected);
    done();
  });

  it('endDate is defined ', (done) => {
    const query = Coffee.find({ id: 1 }, 'all', { returnAsQuery: true });
    const expected = 'select * from "coffee" where "id" = 1 and "created_at" < \'2020-01-01\'';
    Table.addTimeInterval(query, null, '2020-01-01');
    assert.equal(query.toString(), expected);
    done();
  });

  it('custom addTimeInterval ', (done) => {
    const endDate = '2020-01-01';
    const test = new TestClass();
    const query = test.find({ id: 1 }, 'all', { returnAsQuery: true, endDate });
    const expected = 'select * from "coffee" where "id" = 1 and ("created_at" at time zone timezone) < \'2020-01-01\'';
    assert.equal(query.toString(), expected);
    done();
  });

  it('custom addTimeInterval: pass created attribute ', (done) => {
    const endDate = '2020-01-01';
    const test = new TestClass();
    const query = test.find({ id: 1 }, 'all', { returnAsQuery: true, endDate, skipTimezone: true });
    const expected = 'select * from "coffee" where "id" = 1 and "created_at" < \'2020-01-01\'';
    assert.equal(query.toString(), expected);
    done();
  });

  it('startDate passed as Date object ', (done) => {
    const query = Coffee.find({ id: 1 }, 'all', { returnAsQuery: true });
    Table.addTimeInterval(query, new Date('2020-01-01'));
    const expected = 'select * from "coffee" where "id" = 1 and "created_at" > ';
    assert.isTrue(query.toString().startsWith(expected), `${query.toString()} should start with ${expected}`);
    done();
  });

  it('options passed with startDate', (done) => {
    const query = Coffee.find({ id: 1 }, 'all', { returnAsQuery: true });
    Table.addTimeInterval(query, { startDate: '2020-01-01' });
    const expected = 'select * from "coffee" where "id" = 1 and "created_at" > \'2020-01-01\'';
    assert.equal(query.toString(), expected);
    done();
  });

  it('endDate passed with options ', (done) => {
    const query = Coffee.find({ id: 1 }, 'all', { returnAsQuery: true });
    const expected = 'select * from "coffee" where "id" = 1 and "created_at" < \'2020-01-01\'';
    Table.addTimeInterval(query, { endDate: '2020-01-01' });
    assert.equal(query.toString(), expected);
    done();
  });
});
