/* global it, describe */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const { Table } = require('../../../..');


// Our parent block
describe('TABLE GATEWAY: isComposed', () => { // eslint-disable-line max-lines-per-function

  it('is not array', (done) => {
    assert.isFalse(Table.isComposed('text'));
    done();
  });

  it('is not of length 3 ', (done) => {
    assert.isFalse(Table.isComposed(['a', 'or']));
    done();
  });

  it(' unknown operator ', (done) => {
    assert.isFalse(Table.isComposed(['a', 'xor', 'b']));
    done();
  });

  it(' happy path ', (done) => {
    assert.isTrue(Table.isComposed(['a', 'or', 'b']));
    done();
  });
});
