/* global it, describe */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const { Table } = require('../../../..');


// Our parent block
describe('TABLE GATEWAY: isComposed', () => { // eslint-disable-line max-lines-per-function

  it('is not an array', (done) => {
    assert.isFalse(Table.isSpecial('not an array'));
    done();
  });


  it('is an array too short', (done) => {
    assert.isFalse(Table.isSpecial([]));
    done();
  });

  it('is special', (done) => {
    assert.isTrue(Table.isSpecial(['>', 10]));
    done();
  });

});
