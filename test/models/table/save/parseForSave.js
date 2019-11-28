// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const Table = require('../../../../models/table');


// Our parent block
describe('TABLE GATEWAY: parse for savesave', () => { // eslint-disable-line

  it('Happy path', async () => { // eslint-disable-line
    const entry = {
      name: 'name',
      price: 120,
      id: 100,
      created_at: 'hola',
      updated_at: 'hi',
    };
    const parsed = Table.parseForSave(entry);
    assert.equal(parsed.name, 'name');
    assert.equal(parsed.price, 120);
    assert.isUndefined(parsed.id);
    assert.instanceOf(parsed.created_at, Date);
    assert.instanceOf(parsed.updated_at, Date);
  });

  it('Entry is undef', async () => { // eslint-disable-line
    const parsed = Table.parseForSave();
    assert.isUndefined(parsed);
  });
});
