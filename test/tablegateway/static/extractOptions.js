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

  it('Extract rawWhere',  (done) => { // eslint-disable-line
    const query = { name: 'some', rawWhere: 'price = 60 or price = 40' };
    const extracted = Table.extractOptions(Utils.cloneJSON(query));
    assert.equal(Object.keys(extracted).length, 1);
    assert.exists(extracted.rawWhere);
    assert.equal(query.rawWhere, extracted.rawWhere);
    done();
  });

  it('Extract rawWhere as array',  (done) => { // eslint-disable-line
    const query = { name: 'some', rawWhere: '["price = ? or price = 40", 6]' };
    const extracted = Table.extractOptions(Utils.cloneJSON(query));
    assert.equal(Object.keys(extracted).length, 1);
    assert.exists(extracted.rawWhere);
    assert.isArray(extracted.rawWhere);
    assert.equal(extracted.rawWhere[0], 'price = ? or price = 40');
    assert.equal(extracted.rawWhere[1], 6);


    done();
  });
});
