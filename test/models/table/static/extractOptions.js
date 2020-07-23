// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const Utils = require('codemaster').utils;

const { Table } = require('../../../..');


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
    const input = Utils.cloneJSON(query);
    const expected = Utils.cloneJSON(query);
    delete expected.price;
    const extracted = Table.extractOptions(input);
    assert.deepEqual(extracted, expected);
    assert.equal(Object.keys(input).length, 1);
    assert.equal(input.price, 40);
    done();
  });

  it('Extract rawWhere', (done) => { // eslint-disable-line
    const q = {
      name: 'some',
      rawWhere: 'price = 60 or price = 40',
    };
    const extracted = Table.extractOptions(Utils.cloneJSON(q));
    assert.equal(Object.keys(extracted).length, 1);
    assert.exists(extracted.rawWhere);
    assert.equal(q.rawWhere, extracted.rawWhere);
    done();
  });

  it('Extract rawWhere as array', (done) => { // eslint-disable-line
    const q = {
      name: 'some',
      rawWhere: '["price = ? or price = 40", 6]',
    };
    const extracted = Table.extractOptions(Utils.cloneJSON(q));
    assert.equal(Object.keys(extracted).length, 1);
    assert.exists(extracted.rawWhere);
    assert.isArray(extracted.rawWhere);
    assert.equal(extracted.rawWhere[0], 'price = ? or price = 40');
    assert.equal(extracted.rawWhere[1], 6);
    done();
  });

  describe('security mode', () => { // eslint-disable-line
    it('No raw given ', (done) => { // eslint-disable-line
      const input = Utils.cloneJSON(query);
      delete input.rawSelect;
      const expected = Utils.cloneJSON(input);
      delete expected.price;
      const extracted = Table.extractOptions(input, true);
      assert.deepEqual(extracted, expected);
      assert.equal(Object.keys(input).length, 1);
      assert.equal(input.price, 40);
      done();
    });

    it('With raw where and raw select ', (done) => { // eslint-disable-line
      const input = Utils.cloneJSON(query);
      input.rawWhere = 'raw where';
      const expected = Utils.cloneJSON(input);
      delete expected.price;
      delete expected.rawWhere;
      delete expected.rawSelect;
      const extracted = Table.extractOptions(input, true);
      assert.deepEqual(extracted, expected);
      assert.equal(Object.keys(input).length, 1);
      assert.equal(input.price, 40);
      done();
    });
  });

  it('extract CountDistict ', (done) => { // eslint-disable-line
    const input = { countDistinct: 'id', other: 'other' };
    const expected = { countDistinct: 'id' };
    const extracted = Table.extractOptions(input, true);
    assert.deepEqual(extracted, expected);
    assert.equal(Object.keys(input).length, 1);
    assert.equal(input.other, 'other');
    done();
  });
});
