// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const { Access } = require('../../../index');

const { assert } = chai;


// Our parent block
describe('MODELS: ACCESS isAdmin', () => { // eslint-disable-line

  it('user is undef', (done) => { // eslint-disable-line
    const bool = Access.isAdmin();
    assert.isFalse(bool);
    done();
  });

  it('user.is_admin = true', (done) => { // eslint-disable-line
    const bool = Access.isAdmin({ is_admin: true });
    assert.isTrue(bool);
    done();
  });

  it('user does not have access', (done) => { // eslint-disable-line
    const bool = Access.isAdmin({});
    assert.isFalse(bool);
    done();
  });

  it('user has admin role', (done) => { // eslint-disable-line
    const bool = Access.isAdmin({ access: [{ role: 'admin' }] });
    assert.isTrue(bool);
    done();
  });

  it('user does not have admin role', (done) => { // eslint-disable-line
    const bool = Access.isAdmin({ access: [{ role: 'other' }] });
    assert.isFalse(bool);
    done();
  });

});
