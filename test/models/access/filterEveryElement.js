// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const { Access } = require('../../../index');

const { assert } = chai;


// Our parent block
describe('MODELS: ACCESS searchingInArray', () => { // eslint-disable-line

  it('search is undef', (done) => { // eslint-disable-line
    const search = null;
    const validIds = [1, 2, 4, 5, 6];
    const expected = ['in', []];
    const result = Access.filterEveryElement(search, 'key', validIds);
    assert.deepEqual(result, expected);
    done();
  });

  it('search[key] is undef ', (done) => { // eslint-disable-line
    const search = { };
    const validIds = [1, 2, 4, 5, 6];
    const expected = ['in', []];
    const result = Access.filterEveryElement(search, 'key', validIds);
    assert.deepEqual(result, expected);
    done();
  });

  it('search[key][1] is not a valid array ', (done) => { // eslint-disable-line
    const search = {
      key: ['in', 'not an array'],
    };
    const validIds = [1, 2, 4, 5, 6];
    const expected = ['in', []];
    const result = Access.filterEveryElement(search, 'key', validIds);
    assert.deepEqual(result, expected);
    done();
  });

  it('validIds is undef ', (done) => { // eslint-disable-line
    const search = {
      key: ['in', [1, 2, 3]],
    };
    const validIds = [];
    const expected = ['in', []];
    const result = Access.filterEveryElement(search, 'key', validIds);
    assert.deepEqual(result, expected);
    done();
  });

  it('Happy path: search are ints ', (done) => { // eslint-disable-line
    const search = {
      key: ['in', [1, 2, 3]],
    };
    const validIds = ['1', '2', '4', '5', '6'];
    const expected = ['in', [1, 2]];
    const result = Access.filterEveryElement(search, 'key', validIds);
    assert.deepEqual(result, expected);
    done();
  });

  it('Happy path: search are strings ', (done) => { // eslint-disable-line
    const search = {
      key: ['in', ['1', '2', '3']],
    };
    const validIds = ['1', '2', '4', '5', '6'];
    const expected = ['in', ['1', '2']];
    const result = Access.filterEveryElement(search, 'key', validIds);
    assert.deepEqual(result, expected);
    done();
  });

});
