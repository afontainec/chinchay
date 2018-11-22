// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');// eslint-disable-line
const Table = require('../../..').Table;
const Utils = require('codemaster').utils;


const assert = chai.assert; //eslint-disable-line


// Our parent block
describe('TABLE GATEWAY: extractQuery', () => { // eslint-disable-line

  it('With No array ',  (done) => { // eslint-disable-line
    const query = { price: '40', name: 'something' };
    const extracted = Table.extractQuery(Utils.cloneJSON(query));
    assert.deepEqual(query, extracted);
    done();
  });

  it('With array',  (done) => { // eslint-disable-line
    done('NOT IMPLEMENTED');
  });

  it('With an array within another array',  (done) => { // eslint-disable-line
    done('NOT IMPLEMENTED');
  });
});
