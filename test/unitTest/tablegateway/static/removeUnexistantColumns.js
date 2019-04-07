// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const Table = require('../../../../models/table');


const validColumns = ['valid', 'price', 'name'];

// Our parent block
describe('TABLE GATEWAY: removeUnexistingColumns', () => { // eslint-disable-line

  it('should filter', async () => { // eslint-disable-line
    const entry = ['price', 'name', 'get out'];
    const filtered = await Table.removeUnexistingColumns(validColumns, entry);
    assert.isArray(filtered);
    assert.equal(filtered.length, 2);
    assert.isTrue(filtered.indexOf('price') > -1);
    assert.isTrue(filtered.indexOf('name') > -1);
  });

  it('input is not an array', async () => { // eslint-disable-line
    const filtered = await Table.removeUnexistingColumns(validColumns, 'entry');
    assert.deepEqual(filtered, []);
  });

  it('valid Columns is null', async () => { // eslint-disable-line
    const filtered = await Table.removeUnexistingColumns(null, ['price']);
    assert.deepEqual(filtered, []);
  });
});
