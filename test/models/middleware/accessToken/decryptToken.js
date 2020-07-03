process.env.NODE_ENV = 'test';

const { assert } = require('chai');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'JWT_CHINCHAY_SECRET_CODE';
const accessToken = require('../../../../models/middleware/accessToken');

const ONE_HOUR = 60 * 60;
const now = new Date().getTime() / 1000;
const YESTERDAY = now - 24 * ONE_HOUR;

describe('Middleware: accessToken: decryptToken', () => { // eslint-disable-line


  it('token is undef', (done) => { // eslint-disable-line
    try {
      accessToken.decryptToken();
      done('SHOULD NOT GET HERE');
    } catch (error) {
      assert.equal(error.toString(), 'JsonWebTokenError: jwt must be provided');
      done();
    }
  });

  it('token is not valid', (done) => { // eslint-disable-line
    try {
      accessToken.decryptToken('nonvalidtoken');
      done('SHOULD NOT GET HERE');
    } catch (error) {
      assert.equal(error.toString(), 'JsonWebTokenError: jwt malformed');
      done();
    }
  });

  it('token has expired', (done) => { // eslint-disable-line
    try {
      const token = jwt.sign({ user: 1, exp: YESTERDAY }, secret);
      accessToken.decryptToken(token);
      done('SHOULD NOT GET HERE');
    } catch (error) {
      assert.equal(error.toString(), 'TokenExpiredError: jwt expired');
      done();
    }
  });

  it('token is valid', (done) => { // eslint-disable-line
    const token = jwt.sign({ user: 1 }, secret);
    const decoded = accessToken.decryptToken(token);
    const expected = { user: 1 };
    assert.equal(decoded.user, expected.user);
    done();
  });
});
