// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const Coffee = require('../../../models/coffee-example');

// Our parent block
describe('TABLE GATEWAY: columnsNamesQuery', () => { // eslint-disable-line

  it('return correct query ',  (done) => { // eslint-disable-line
    const query = Coffee.columnsNamesQuery();
    const string = query.toString();
    assert.equal(string, 'select "column_name" from "information_schema"."columns" where "table_name" = \'coffee\'');
    done();
  });
});
