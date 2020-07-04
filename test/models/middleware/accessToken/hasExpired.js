process.env.NODE_ENV = 'test';

const { assert } = require('chai');
const accessToken = require('../../../../models/middleware/accessToken');

const ONE_HOUR = 60 * 60;
const now = new Date().getTime() / 1000;
const YESTERDAY = now - 24 * ONE_HOUR;
const TOMORROW = now + 24 * ONE_HOUR;
describe('Middleware: accessToken: hasExpired', () => { // eslint-disable-line


  it('data is undef', (done) => { // eslint-disable-line
    const expired = accessToken.hasExpired();
    assert.isTrue(expired);
    done();
  });


  it('data.exp is not valid', (done) => { // eslint-disable-line
    const expired = accessToken.hasExpired();
    assert.isTrue(expired);
    done();
  });

  it('has Expired', (done) => { // eslint-disable-line
    const data = {
      exp: YESTERDAY,
    };
    const expired = accessToken.hasExpired(data);
    assert.isTrue(expired);
    done();
  });

  it('has not expired', (done) => { // eslint-disable-line
    const data = {
      exp: TOMORROW,
    };
    const expired = accessToken.hasExpired(data);
    assert.isFalse(expired);
    done();
  });
});
