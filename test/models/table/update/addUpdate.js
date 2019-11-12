// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const Table = require('../../../../models/table');
const Coffee = require('../../../../models/coffee-example');

// Our parent block
describe('TABLE GATEWAY: add update', () => { // eslint-disable-line

  it('query is knex object ',  (done) => { // eslint-disable-line
    let query = Coffee.table();
    const values = { price: 10 };
    query = Table.addUpdate(query, values);
    const string = query.toString();
    assert.isTrue(string.startsWith('update "coffee" set "price" = 10, "updated_at" ='));
    assert.isTrue(string.endsWith('returning *'));
    done();
  });

  it('query is undefined ',  (done) => { // eslint-disable-line
    const values = { price: 10 };
    assert.isUndefined(Table.addUpdate(undefined, values));
    done();
  });

  it('values is undefined ',  (done) => { // eslint-disable-line
    let query = Coffee.table();
    query = Table.addUpdate(query);
    const string = query.toString();
    assert.equal(string, 'select * from "coffee"');
    done();
  });

  it('query is defined but not a knex object',  (done) => { // eslint-disable-line
    let query = 'yes';
    const values = { price: 10 };
    query = Table.addUpdate(query, values);
    const string = query.toString();
    assert.equal(string, 'yes');
    done();
  });
});
