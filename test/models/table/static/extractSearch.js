// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const Utils = require('codemaster').utils;
const { Table } = require('../../../..');


// Our parent block
describe('TABLE GATEWAY: extractSearch', () => { // eslint-disable-line

  it('With No array ',  (done) => { // eslint-disable-line
    const query = { price: '40', name: 'something' };
    const extracted = Table.extractSearch(Utils.cloneJSON(query));
    assert.deepEqual(query, extracted);
    done();
  });

  it('With array',  (done) => { // eslint-disable-line
    const query = { price: '40', array: '["<>", "something"]' };
    const extracted = Table.extractSearch(Utils.cloneJSON(query));
    assert.equal(query.price, extracted.price);
    assert.isArray(extracted.array);
    assert.equal(extracted.array.length, 2);
    assert.equal(extracted.array[0], '<>');
    assert.equal(extracted.array[1], 'something');
    done();
  });

  it('With an array within another array',  (done) => { // eslint-disable-line
    const innerArray = ['something', 'other', 'extra'];
    const query = { price: '40', array: '["in", ["something", "other", "extra"]]' };
    const extracted = Table.extractSearch(Utils.cloneJSON(query));
    assert.equal(query.price, extracted.price);
    assert.isArray(extracted.array);
    assert.equal(extracted.array.length, 2);
    assert.equal(extracted.array[0], 'in');
    assert.isArray(extracted.array[1]);
    assert.equal(extracted.array[1].length, 3);
    assert.equal(extracted.array[1].length, 3);
    assert.deepEqual(innerArray, extracted.array[1]);

    done();
  });
});
