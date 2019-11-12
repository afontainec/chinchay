// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Table = require('../../../../models/table');


// Our parent block
describe('TABLE GATEWAY: Add Sum Select', () => { // eslint-disable-line no-undef, max-lines-per-function

  it('options is undef', (done) => { // eslint-disable-line no-undef
    const query = knex('coffee');
    Table.addSumSelect(query, 'amount');
    const expected = 'select sum("amount") from "coffee"';
    assert.equal(query.toString(), expected);
    done();
  });

  it('has raw select', (done) => { // eslint-disable-line no-undef
    const query = knex('coffee');
    const options = {
      rawSelect: 'name as type',
    };
    Table.addSumSelect(query, 'amount', options);
    const expected = 'select name as type, sum("amount") from "coffee"';
    assert.equal(query.toString(), expected);
    done();
  });

  it('happy path', (done) => { // eslint-disable-line no-undef
    const query = knex('coffee');
    const options = { };
    Table.addSumSelect(query, 'amount', options);
    const expected = 'select sum("amount") from "coffee"';
    assert.equal(query.toString(), expected);
    done();
  });

  it('column is undefined', (done) => { // eslint-disable-line no-undef
    try {
      const query = knex('coffee');
      const options = { };
      Table.addSumSelect(query, null, options);
      done('SHOULD HAVE RETURNED AN ERROR');
    } catch (error) {
      done();
    }
  });
});
