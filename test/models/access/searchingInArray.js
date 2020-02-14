// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const { Access } = require('../../../index');

const { assert } = chai;


// Our parent block
describe('MODELS: ACCESS searchingInArray', () => { // eslint-disable-line

  it('input is undef', (done) => { // eslint-disable-line
    const bool = Access.searchingInArray();
    assert.isFalse(bool);
    done();
  });

  it('input is array without first element', (done) => { // eslint-disable-line
    const bool = Access.searchingInArray([]);
    assert.isFalse(bool);
    done();
  });

  it('input is array with first element !== in ', (done) => { // eslint-disable-line
    const bool = Access.searchingInArray(['yeah']);
    assert.isFalse(bool);
    done();
  });

  it('input is array with first element === in ', (done) => { // eslint-disable-line
    const bool = Access.searchingInArray(['in']);
    assert.isTrue(bool);
    done();
  });

});
