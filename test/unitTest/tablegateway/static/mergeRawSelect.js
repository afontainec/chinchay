// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const { Table } = require('../../../..');


// Our parent block
describe('TABLE GATEWAY: merge raw select', () => { // eslint-disable-line

  it('Array and non Array',  (done) => { // eslint-disable-line
    const first = ['EXTRACT(doy from ?)', 'created_at'];
    const second = 'count(*)';
    const merged = Table.mergeRawSelect(first, second);
    assert.equal(merged, 'EXTRACT(doy from \'created_at\'), count(*)');
    done();
  });

  it('non Array and Array',  (done) => { // eslint-disable-line
    const second = ['EXTRACT(doy from ?)', 'created_at'];
    const first = 'count(*)';
    const merged = Table.mergeRawSelect(first, second);
    assert.equal(merged, 'count(*), EXTRACT(doy from \'created_at\')');
    done();
  });

  it('non Array and non Array',  (done) => { // eslint-disable-line
    const first = 'EXTRACT(doy from created_at)';
    const second = 'count(*)';
    const merged = Table.mergeRawSelect(first, second);
    assert.equal(typeof merged, 'string');
    assert.equal(merged, 'EXTRACT(doy from created_at), count(*)');
    done();
  });

  it('undefined and non Array',  (done) => { // eslint-disable-line
    const first = undefined;
    const second = 'count(*)';
    const merged = Table.mergeRawSelect(first, second);
    assert.equal(merged, second);
    done();
  });

  it('non Array and undefined',  (done) => { // eslint-disable-line
    const second = undefined;
    const first = 'count(*)';
    const merged = Table.mergeRawSelect(first, second);
    assert.equal(merged, first);
    done();
  });

  it(' Array and Array',  (done) => { // eslint-disable-line
    const first = ['EXTRACT(doy from ?)', 'created_at'];
    const second = ['EXTRACT(hour from ?)', 'created_at'];
    const merged = Table.mergeRawSelect(first, second);
    assert.equal(merged, 'EXTRACT(doy from \'created_at\'), EXTRACT(hour from \'created_at\')');
    done();
  });
});
