// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const { Access } = require('../../../index');

const { assert } = chai;


// Our parent block
describe('MODELS: ACCESS hasAccessTo', () => { // eslint-disable-line

  it('user is undef', (done) => { // eslint-disable-line
    const bool = Access.hasAccessTo(null, 'places', 1);
    assert.isFalse(bool);
    done();
  });

  it('user.access is undef', (done) => { // eslint-disable-line
    const bool = Access.hasAccessTo({}, 'places', 1);
    assert.isFalse(bool);
    done();
  });

  it('to is undef', (done) => { // eslint-disable-line
    const bool = Access.hasAccessTo({ access: [] });
    assert.isFalse(bool);
    done();
  });

  it('user has access to all', (done) => { // eslint-disable-line
    const bool = Access.hasAccessTo({ access: [{ role: 'admin' }] }, 'places', 66);
    assert.isTrue(bool);
    done();
  });

  it('user has restricted access: both ints', (done) => { // eslint-disable-line
    const bool = Access.hasAccessTo({ access: [{ role: 'venueOwner', filter: 66 }] }, 'places', 66);
    assert.isTrue(bool);
    done();
  });

  it('user has restricted access: one as int the other as string', (done) => { // eslint-disable-line
    const bool = Access.hasAccessTo({ access: [{ role: 'venueOwner', filter: '66' }] }, 'places', 66);
    assert.isTrue(bool);
    done();
  });

  it('user does have restricted access but with different filter', (done) => { // eslint-disable-line
    const bool = Access.hasAccessTo({ access: [{ role: 'venueOwner', filter: 67 }] }, 'places', 66);
    assert.isFalse(bool);
    done();
  });

  it('user does not have restricted access', (done) => { // eslint-disable-line
    const bool = Access.hasAccessTo({ access: [{ role: 'other', filter: 66 }] }, 'places', 66);
    assert.isFalse(bool);
    done();
  });

});
