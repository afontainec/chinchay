// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: SumQuery', () => { // eslint-disable-line no-undef, max-lines-per-function

  it('happy path', (done) => { // eslint-disable-line no-undef
    const column = 'amount';
    const search = { name: 'name' };
    const options = {};
    const query = Coffee.sumQuery(column, search, options);
    const expected = 'select sum("amount") from "coffee" where "name" = \'name\'';
    assert.equal(query.toString(), expected);
    done();
  });
});
