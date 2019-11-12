// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const { Table } = require('../../../..');

const Coffee = new Table('coffee');


// Our parent block
describe('TABLE GATEWAY: return as query', () => { // eslint-disable-line

  it('In find ', (done) => { // eslint-disable-line
    const query = Coffee.find({}, 'all', { returnAsQuery: true });
    const knexQuery = knex('coffee').select('*');
    assert.equal(typeof query, 'object');
    assert.equal(query.toString(), knexQuery.toString());
    done();
  });

  it('In find: not given return as query', (done) => { // eslint-disable-line
    const query = Coffee.find({}, 'all', { returnAsQuery: false });
    assert.equal(typeof query, 'object');
    assert.equal(query.toString(), '[object Promise]');
    done();
  });

  it('In count ', (done) => { // eslint-disable-line
    const query = Coffee.count({}, { returnAsQuery: true });
    const knexQuery = knex('coffee').count('*');
    assert.equal(typeof query, 'object');
    assert.equal(query.toString(), knexQuery.toString());
    done();
  });

  it('In count: not given return as query', (done) => { // eslint-disable-line
    const query = Coffee.count({}, { returnAsQuery: false });
    assert.equal(typeof query, 'object');
    assert.equal(query.toString(), '[object Promise]');
    done();
  });
});
