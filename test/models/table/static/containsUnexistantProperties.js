// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const Table = require('../../../../models/table');


const validColumns = ['valid', 'price', 'name'];

// Our parent block
describe('TABLE GATEWAY: containsUnexistingProperties', () => { // eslint-disable-line

  it('has unexistant property', async () => { // eslint-disable-line
    const entry = {
      no: 'yes',
      price: 100,
    };
    const contains = await Table.containsUnexistingProperties(validColumns, entry);
    assert.isTrue(contains);
  });

  it('does not have unexistant property', async () => { // eslint-disable-line
    const entry = {
      price: 100,
    };
    const contains = await Table.containsUnexistingProperties(validColumns, entry);
    assert.isFalse(contains);
  });

  it('input is not an array', async () => { // eslint-disable-line
    const contains = await Table.containsUnexistingProperties(validColumns, 'entry');
    assert.isFalse(contains);
  });

  it('valid Columns is null', async () => { // eslint-disable-line
    const entry = {
      price: 100,
    };
    const contains = await Table.containsUnexistingProperties(null, entry);
    assert.isFalse(contains);
  });
});
