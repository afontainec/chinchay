/* global describe, it, before */
process.env.NODE_ENV = 'test';

const jwt = require('jsonwebtoken');
const { assert } = require('chai');

const secret = process.env.JWT_SECRET || 'JWT_CHINCHAY_SECRET_CODE';
const accessToken = require('../../../../models/middleware/accessToken');
const { thewall } = require('../../../../.chainfile');
// eslint-disable-next-line import/no-dynamic-require
const TheWall = require(thewall);
const ONE_HOUR_IN_SECONDS = 60 * 60;
const ONE_HOUR_IN_MILLISECONDS = ONE_HOUR_IN_SECONDS * 1000;
const now = new Date().getTime();

describe('Middleware: accessToken: generate', () => { // eslint-disable-line max-lines-per-function

  before(() => {
    accessToken.bootstrap(TheWall);
  });

  it('no user', (done) => {
    try {
      accessToken.generate();
      done(new Error('SHOULD NOT GET HERE'));
    } catch (error) {
      assert.equal(error.toString(), 'Error: No User defined');
      done();
    }
  });

  it('Bootstrapped with specific window', (done) => {
    accessToken.bootstrap(TheWall, ONE_HOUR_IN_SECONDS);
    const result = accessToken.generate({ id: 1234 });
    assert.isDefined(result.expiration);
    assert.isDefined(result.token);
    const decoded = jwt.verify(result.token, secret);
    assert.equal(decoded.user, 1234);
    assert.closeTo(result.expiration.getTime() - now, ONE_HOUR_IN_MILLISECONDS, 1000);
    done();
  });

  it('user is defined', (done) => {
    accessToken.bootstrap(TheWall);
    const result = accessToken.generate({ id: 1234 });
    assert.isDefined(result.expiration);
    assert.isDefined(result.token);
    const decoded = jwt.verify(result.token, secret);
    assert.closeTo(result.expiration.getTime() - now, 7 * 24 * ONE_HOUR_IN_MILLISECONDS, 1000);
    assert.equal(decoded.user, 1234);
    done();
  });


});
