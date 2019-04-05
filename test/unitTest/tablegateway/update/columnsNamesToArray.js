// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const Table = require('../../../../models/table');

const columnsNames = [{
  column_name: 'yes',
}, {
  column_name: 'no',
}];
// Our parent block
describe('TABLE GATEWAY: columns Names to Array', () => { // eslint-disable-line

  it('expected output',  (done) => { // eslint-disable-line
    const array = Table.columnsNamesToArray(columnsNames);
    assert.deepEqual(array, ['yes', 'no']);
    done();
  });

  it('input is null',  (done) => { // eslint-disable-line
    const array = Table.columnsNamesToArray();
    assert.deepEqual(array, []);
    done();
  });
});
