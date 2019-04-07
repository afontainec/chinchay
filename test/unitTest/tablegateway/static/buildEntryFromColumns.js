// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const { Table } = require('../../../..');


// Our parent block
describe('TABLE GATEWAY: build Entry From Columns', () => { // eslint-disable-line

  it('returns entry with every variable in null ',  (done) => { // eslint-disable-line
    const columns = ['price', 'name'];
    const entry = Table.buildEntryFromColumns(columns);
    assert.isDefined(entry);
    const properties = Object.keys(entry);
    assert.deepEqual(columns, properties);
    done();
  });

  it('Columns is empty',  (done) => { // eslint-disable-line
    const columns = [];
    const entry = Table.buildEntryFromColumns(columns);
    assert.isDefined(entry);
    const properties = Object.keys(entry);
    assert.deepEqual(columns, properties);
    done();
  });

  it('Columns is null',  (done) => { // eslint-disable-line
    const entry = Table.buildEntryFromColumns();
    assert.isDefined(entry);
    const properties = Object.keys(entry);
    assert.deepEqual([], properties);
    done();
  });
});
