process.env.NODE_ENV = 'test';

const { assert } = require('chai');

const accessToken = require('../../../../models/middleware/accessToken');

describe('Middleware: accessToken: extractToken', () => { // eslint-disable-line


  it('header is undef', (done) => { // eslint-disable-line
    try {
      accessToken.extractToken();
      done(new Error('SHOULD NOT GET HERE'));
    } catch (error) {
      assert.equal(error.toString(), 'Error: no authorization header defined');
      done();
    }
  });

  it('header does not have Bearer', (done) => { // eslint-disable-line
    try {
      accessToken.extractToken('other stuff');
      done(new Error('SHOULD NOT GET HERE'));
    } catch (error) {
      assert.equal(error.toString(), 'Error: Auth header badly defined');
      done();
    }
  });

  it('header has many Bearers', (done) => { // eslint-disable-line
    try {
      accessToken.extractToken('Bearer other Bearer stuff');
      done(new Error('SHOULD NOT GET HERE'));
    } catch (error) {
      assert.equal(error.toString(), 'Error: Auth header badly defined');
      done();
    }
  });

  it('happy path', (done) => { // eslint-disable-line
    const token = accessToken.extractToken('Bearer token');
    assert.equal(token, 'token');
    done();
  });
});
