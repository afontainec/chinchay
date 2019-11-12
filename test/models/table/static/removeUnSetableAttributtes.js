// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const { Table } = require('../../../..');


// Our parent block
describe('TABLE GATEWAY: remove unsetable properties', () => { // eslint-disable-line

  it('remove all ',  (done) => { // eslint-disable-line
    const obj = {
      id: 1,
      created_at: new Date(),
      updated_at: new Date(),
    };

    Table.removeUnSetableAttributes(obj);
    assert.isDefined(obj);
    assert.isFalse(Object.prototype.hasOwnProperty.call(obj, 'id'));
    assert.isFalse(Object.prototype.hasOwnProperty.call(obj, 'created_at'));
    assert.isFalse(Object.prototype.hasOwnProperty.call(obj, 'updated_at'));
    done();
  });

  it('Properties does not exist',  (done) => { // eslint-disable-line
    const obj = {
    };

    Table.removeUnSetableAttributes(obj);
    assert.isDefined(obj);
    assert.isFalse(Object.prototype.hasOwnProperty.call(obj, 'id'));
    assert.isFalse(Object.prototype.hasOwnProperty.call(obj, 'created_at'));
    assert.isFalse(Object.prototype.hasOwnProperty.call(obj, 'updated_at'));
    done();
  });

  it('Object is undefined',  (done) => { // eslint-disable-line
    const input = null;
    Table.removeUnSetableAttributes(input);
    assert.isNull(input);
    done();
  });
});
