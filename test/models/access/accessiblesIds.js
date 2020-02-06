// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const { Access } = require('../../../index');

const { assert } = chai;


// Our parent block
describe('MODELS: ACCESS.accessiblesIds', () => { // eslint-disable-line

  it('access is undef', (done) => { // eslint-disable-line
    const result = Access.accessiblesIds(null, 'places');
    assert.deepEqual(result, []);
    done();
  });

  it('to is undef', (done) => { // eslint-disable-line
    const result = Access.accessiblesIds([]);
    assert.deepEqual(result, []);
    done();
  });

  it('to does not have restricted_roles', (done) => { // eslint-disable-line
    const result = Access.accessiblesIds([], 'other');
    assert.deepEqual(result, []);
    done();
  });

  it('Happy path', (done) => { // eslint-disable-line
    const access = [{ role: 'other', filter: 66 }, { role: 'venueOwner', filter: 1 }, { role: 'venueOwner', filter: 2 }];
    const result = Access.accessiblesIds(access, 'places');
    assert.deepEqual(result, [1, 2]);
    done();
  });

});
