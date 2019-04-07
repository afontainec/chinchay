// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const Coffee = require('../../../../models/coffee-example');

// Our parent block
describe('TABLE GATEWAY: update Query', () => { // eslint-disable-line

  it('happy path ',  (done) => { // eslint-disable-line
    const values = { name: 'changed' };
    const where = { id: 1 };
    const options = { startDate: '2019/01/01' };
    const query = Coffee.updateQuery(where, values, options);
    const string = query.toString();
    assert.isTrue(string.startsWith('update "coffee" set "name" = \'changed\', "updated_at" ='));
    assert.isTrue(string.endsWith(' where "id" = 1 and "created_at" > \'2019/01/01\' returning *'));
    done();
  });
});
