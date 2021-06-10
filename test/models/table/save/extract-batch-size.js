/* global describe, it */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: extractBatchSize', () => { // eslint-disable-line max-lines-per-function

  it('is number', async () => {
    const batchSize = Coffee.extractBatchSize(3);
    assert.equal(batchSize, 3);
  });

  it('input has .batchSize', () => {
    const batchSize = Coffee.extractBatchSize({ batchSize: 10 });
    assert.equal(batchSize, 10);
  });

  it('input does not have .batchSize', () => {
    const batchSize = Coffee.extractBatchSize({ });
    assert.isUndefined(batchSize);
  });

  it('input is undefined', () => {
    const batchSize = Coffee.extractBatchSize();
    assert.isUndefined(batchSize);
  });

});
