// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const { httpResponse } = require('../../..');

const { assert } = chai;


// Our parent block
describe('Http Response: Success', () => { // eslint-disable-line


  it('keys is null',  (done) => { // eslint-disable-line
    const result = httpResponse.success('test', null, '500');
    const expected = {
      message: 'test',
      null: '500',
    };
    assert.deepEqual(result, expected);
    done();
  });

  it('keys is array',  (done) => { // eslint-disable-line
    const result = httpResponse.success('test', ['k1', 'k2', 'k3'], ['v1', 'v2', 'v3']);
    const expected = {
      message: 'test',
      k1: 'v1',
      k2: 'v2',
      k3: 'v3',
    };
    assert.deepEqual(result, expected);
    done();
  });

  it('keys is not array',  (done) => { // eslint-disable-line
    process.env.NODE_ENV = 'production';
    const result = httpResponse.success('test', 'k', 'v');
    const expected = {
      message: 'test',
      k: 'v',
    };
    assert.deepEqual(result, expected);
    done();
  });
});
