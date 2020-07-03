process.env.NODE_ENV = 'test';

const codemaster = require('codemaster');

const Req = codemaster.utils.mocks.express.req;
const { assert } = require('chai');

const accessToken = require('../../../../models/middleware/accessToken');

describe('Middleware: accessToken: addIsNotAuthenticated', () => { // eslint-disable-line


  it('req is undef', (done) => { // eslint-disable-line
    accessToken.addIsNotAuthenticated(null);
    done();
  });

  it('happy path', (done) => { // eslint-disable-line
    const req = Req.generate();
    req.isAuthenticated = undefined;
    accessToken.addIsNotAuthenticated(req);
    assert.isFalse(req.isAuthenticatedByToken());
    assert.isUndefined(req.user_id);
    done();
  });
});
