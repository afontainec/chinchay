// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const assert = require('chai').assert;
const Coffee = require('../../../../models/coffee-example');

// Our parent block
describe('TABLE GATEWAY: add timestamps', () => { // eslint-disable-line

  it('query is knex object ',  (done) => { // eslint-disable-line
    let query = Coffee.table();
    const values = { price: 10 };
    query = Coffee.addUpdate(query, values);
    const string = query.toString();
    assert.equal(string, 'update "coffee" set "price" = 10 returning *');
    done();
  });

  it('query is undefined ',  (done) => { // eslint-disable-line
    const values = { price: 10 };
    assert.isUndefined(Coffee.addUpdate(undefined, values));
    done();
  });

  it('values is undefined ',  (done) => { // eslint-disable-line
    let query = Coffee.table();
    query = Coffee.addUpdate(query);
    const string = query.toString();
    assert.equal(string, 'select * from "coffee"');
    done();
  });

  it('query is defined but not a knex object',  (done) => { // eslint-disable-line
    let query = 'yes';
    const values = { price: 10 };
    query = Coffee.addUpdate(query, values);
    const string = query.toString();
    assert.equal(string, 'yes');
    done();
  });
});
