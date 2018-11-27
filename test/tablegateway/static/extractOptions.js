// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai'); // eslint-disable-line
const Table = require('../../..').Table;
const Utils = require('codemaster').utils;


const assert = chai.assert; //eslint-disable-line

const query = {
  price: '40',
  groupBy: 'name',
  orderBy: 'order',
  startDate: '2018-01-01',
  endDate: '2018-01-01',
  limit: 10,
  offset: 1,
  rawSelect: 'select',
  clearSelect: true,
};


// Our parent block
describe('TABLE GATEWAY: extractOptions', () => { // eslint-disable-line
  it('working correctly ', (done) => { // eslint-disable-line
    const expected = Utils.cloneJSON(query);
    delete expected.price;
    const extracted = Table.extractOptions(query);
    assert.deepEqual(extracted, expected);
    assert.equal(Object.keys(query).length, 1);
    assert.equal(query.price, 40);
    done();
  });
});
