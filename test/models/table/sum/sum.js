// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: SumQuery', () => { // eslint-disable-line no-undef, max-lines-per-function

  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('return as Query', (done) => { // eslint-disable-line no-undef
    const column = 'amount';
    const search = { price: ['>', 90] };
    const options = { returnAsQuery: true };
    const query = Coffee.sum(column, search, options);
    const expected = 'select sum("amount") from "coffee" where "price" > 90';
    assert.equal(query.toString(), expected);
    done();
  });

  it('happy path', async () => { // eslint-disable-line no-undef
    const column = 'price';
    const search = { price: ['>', 90] };
    const options = { };
    const result = await Coffee.sum(column, search, options);
    assert.equal(result, 310);
  });
});
