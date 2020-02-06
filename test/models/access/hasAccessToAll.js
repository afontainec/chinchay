// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const { Access } = require('../../../index');

const { assert } = chai;


// Our parent block
describe('MODELS: ACCESS hasAccessToAll', () => { // eslint-disable-line

  it('user is undef', (done) => { // eslint-disable-line
    const bool = Access.hasAccessToAll();
    assert.isFalse(bool);
    done();
  });

  it('user.access is undef', (done) => { // eslint-disable-line
    const bool = Access.hasAccessToAll({});
    assert.isFalse(bool);
    done();
  });

  it('user is admin', (done) => { // eslint-disable-line
    const bool = Access.hasAccessToAll({ is_admin: true });
    assert.isTrue(bool);
    done();
  });

  it('user has access to all', (done) => { // eslint-disable-line
    const bool = Access.hasAccessToAll({ access: [{ role: 'placesAdmin' }] }, 'places');
    assert.isTrue(bool);
    done();
  });

  it('user does not have access to all', (done) => { // eslint-disable-line
    const bool = Access.hasAccessToAll({ access: [{ role: 'other' }] }, 'places');
    assert.isFalse(bool);
    done();
  });

  it('to does not have UNRESTRICTED_ROLES', (done) => { // eslint-disable-line
    const bool = Access.hasAccessToAll({ access: [{ role: 'other' }] }, 'other');
    assert.isFalse(bool);
    done();
  });

});
