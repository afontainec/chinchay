// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const knex = require('../knex');
const Table = require('..').Table;


const assert = chai.assert; //eslint-disable-line


// Our parent block
describe('TABLE GATEWAY: count', () => { // eslint-disable-line

  it('Array and non Array',  (done) => { // eslint-disable-line
    const first = ['EXTRACT(doy from ?)', 'created_at'];
    const second = 'count(*)';
    const merged = Table.mergeRawSelect(first, second);
    assert.isArray(merged);
    assert.equal(merged[1], first[1]);
    assert.equal(merged[0], 'EXTRACT(doy from ?), count(*)');

    done();
  });

  it('non Array and Array',  (done) => { // eslint-disable-line
    const second = ['EXTRACT(doy from ?)', 'created_at'];
    const first = 'count(*)';
    const merged = Table.mergeRawSelect(first, second);
    assert.isArray(merged);
    assert.equal(merged[1], second[1]);
    assert.equal(merged[0], 'EXTRACT(doy from ?), count(*)');
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
    const first = ['EXTRACT(doy from created_at', 'created_at'];
    const second = ['EXTRACT(hour from created_at', 'created_at'];
    try {
      Table.mergeRawSelect(first, second);
      done('SHOULD NOT GET HERE');
    } catch (e) {
      assert.equal(e.toString(), 'Error: Cannot merge two raw select');
      done();
    }
  });
});
