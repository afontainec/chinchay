/* global describe, it */
process.env.NODE_ENV = 'test';

const jwt = require('jsonwebtoken');
const { assert } = require('chai');

const secret = process.env.JWT_SECRET || 'JWT_CHINCHAY_SECRET_CODE';
const accessToken = require('../../../../models/middleware/accessToken');

describe('Middleware: accessToken: generate', () => { // eslint-disable-line max-lines-per-function


  it('no user', (done) => {
    try {
      accessToken.generate();
      done(new Error('SHOULD NOT GET HERE'));
    } catch (error) {
      assert.equal(error.toString(), 'Error: No User defined');
      done();
    }
  });

  it('user is defined', (done) => {
    const result = accessToken.generate({ id: 1234 });
    assert.isDefined(result.expiration);
    assert.isDefined(result.token);
    const decoded = jwt.verify(result.token, secret);
    assert.equal(decoded.user, 1234);
    done();

  });


});
