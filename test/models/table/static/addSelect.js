// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Table = require('../../../../models/table');


// Our parent block
describe('Tablegateway: add Select', () => { // eslint-disable-line no-undef, max-lines-per-function

  it('type is find', (done) => { // eslint-disable-line no-undef
    const query = knex('coffee');
    const columns = 'all';
    const options = {};
    Table.addSelect('find', query, columns, options);
    const expected = 'select * from "coffee"';
    assert.equal(query.toString(), expected);
    done();
  });

  it('type is count', (done) => { // eslint-disable-line no-undef
    const query = knex('coffee');
    const columns = 'all';
    const options = {};
    Table.addSelect('count', query, columns, options);
    const expected = 'select count(*) from "coffee"';
    assert.equal(query.toString(), expected);
    done();
  });

  it('type is sum', (done) => { // eslint-disable-line no-undef
    const query = knex('coffee');
    const columns = 'all';
    const options = {};
    Table.addSelect('sum', query, columns, options);
    const expected = 'select sum("all") from "coffee"';
    assert.equal(query.toString(), expected);
    done();
  });

  it('type is delete', (done) => { // eslint-disable-line no-undef
    const query = knex('coffee');
    const columns = 'all';
    const options = {};
    Table.addSelect('delete', query, columns, options);
    const expected = 'delete from "coffee" returning *';
    assert.equal(query.toString(), expected);
    done();
  });

  it('type is undefined', (done) => { // eslint-disable-line no-undef
    const query = knex('coffee');
    const columns = 'all';
    const options = {};
    Table.addSelect(undefined, query, columns, options);
    const expected = 'select * from "coffee"';
    assert.equal(query.toString(), expected);
    done();
  });
});
