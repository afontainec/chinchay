/* global describe, it */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: aggregationQuery', () => { // eslint-disable-line max-lines-per-function

  it('happy path', (done) => {
    const column = 'amount';
    const search = { name: 'name' };
    const options = { returnAsQuery: true };
    const query = Coffee.aggregateQuery('sum', column, search, options);
    const expected = 'select sum("amount") from "coffee" where "name" = \'name\'';
    assert.equal(query.toString(), expected);
    done();
  });

  it('return as Query', (done) => {
    const column = 'price';
    const search = { price: ['>', 90] };
    const options = { returnAsQuery: true };
    const query = Coffee.aggregateQuery('sum', column, search, options);
    const expected = 'select sum("price") from "coffee" where "price" > 90';
    assert.equal(query.toString(), expected);
    done();
  });
});
