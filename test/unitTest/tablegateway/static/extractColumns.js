// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const { Table } = require('../../../..');


// Our parent block
describe('TABLE GATEWAY: extractColumns', () => { // eslint-disable-line

  it('One element ',  (done) => { // eslint-disable-line
    const columns = 'price';
    const query = {};
    query.columns = columns;
    const extracted = Table.extractColumns(query);
    assert.isArray(extracted);
    assert.equal(extracted.length, 1);
    assert.equal(columns, extracted[0]);
    assert.notExists(query.columns);

    done();
  });

  it('With array',  (done) => { // eslint-disable-line
    const columns = ['price', 'name'];
    const query = {};
    query.columns = columns;
    const extracted = Table.extractColumns(query);
    assert.isArray(extracted);
    assert.deepEqual(extracted, columns);
    assert.notExists(query.columns);
    done();
  });

  it('With array as String',  (done) => { // eslint-disable-line
    const columns = '["price", "name"]';
    const query = {};
    query.columns = columns;
    const extracted = Table.extractColumns(query);
    assert.isArray(extracted);
    assert.deepEqual(extracted, JSON.parse(columns));
    assert.notExists(query.columns);
    done();
  });

  it('With an array within another array',  (done) => { // eslint-disable-line
    const query = {};
    const extracted = Table.extractColumns(query);
    assert.equal(extracted, 'all');
    assert.notExists(query.columns);

    done();
  });
});
