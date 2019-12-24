// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');
const Table = require('../../../../models/table');

const options = {
  returnAsQuery: true,
  groupBy: 'price',
  rawSelect: 'price',
  orderBy: 'price',
};

// Our parent block
describe('TABLE GATEWAY: SumQuery', () => { // eslint-disable-line no-undef, max-lines-per-function

  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('has group by', async () => { // eslint-disable-line no-undef
    const column = 'price';
    const search = {};

    const query = Coffee.sum(column, search, options);
    const result = await Table.parseSumResult(query);
    const expected = [{
      price: 100,
      sum: '200',
    }, {
      price: 110,
      sum: '110',
    }, { sum: null, price: null }];
    assert.deepEqual(result, expected);
  });

  it('does not have group by', async () => { // eslint-disable-line no-undef
    const column = 'price';
    const search = {};
    const query = Coffee.sum(column, search, { returnAsQuery: true });
    const result = await Table.parseSumResult(query);
    const expected = 310;
    assert.deepEqual(result, expected);
  });

  it('sum is null', async () => { // eslint-disable-line no-undef
    const column = 'price';
    const search = { price: -988766543 };
    const query = Coffee.sum(column, search, { returnAsQuery: true });
    const result = await Table.parseSumResult(query);
    const expected = 0;
    assert.deepEqual(result, expected);
  });
});
