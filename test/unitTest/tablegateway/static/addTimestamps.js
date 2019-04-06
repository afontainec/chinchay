// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const { Table } = require('../../../..');


// Our parent block
describe('TABLE GATEWAY: add timestamps', () => { // eslint-disable-line

  it('isNew ',  (done) => { // eslint-disable-line
    const entry = {};
    Table.addTimestamps(entry, true);
    assert.isDefined(entry.created_at);
    assert.isDefined(entry.updated_at);
    done();
  });

  it('isNew  = false',  (done) => { // eslint-disable-line
    const entry = {};
    Table.addTimestamps(entry, false);
    assert.isUndefined(entry.created_at);
    assert.isDefined(entry.updated_at);
    done();
  });

  it('entry is undef',  (done) => { // eslint-disable-line
    const entry = null;
    Table.addTimestamps(entry, false);
    done();
  });
});
