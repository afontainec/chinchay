// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');// eslint-disable-line
const Table = require('../../../..').Table;


const assert = chai.assert; //eslint-disable-line


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
