/* global it, describe */
process.env.NODE_ENV = 'test';

const codemaster = require('codemaster');

const Req = codemaster.utils.mocks.express.req;
const { assert } = require('chai');
const { Middleware } = require('../../../..');
const accessToken = require('../../../../models/middleware/accessToken');

describe('Middleware: getForbiddenError', () => { // eslint-disable-line max-lines-per-function


  it('it is not authenticated', async () => {
    const req = Req.generate();
    const error = Middleware.getForbiddenError(req);
    assert.equal(error.chinchayCode, 'forbidden');
  });

  it('req.chinchayAuthorization is null', async () => {
    const req = Req.generate();
    accessToken.addIsAuthenticated(req, { user: 1 });
    const error = Middleware.getForbiddenError(req);
    assert.equal(error.chinchayCode, 'forbidden');
  });

  it('req is null', async () => {
    const error = Middleware.getForbiddenError();
    assert.equal(error.chinchayCode, 'forbidden');
  });

  it('empty chinchayAuthorization', async () => {
    const req = Req.generate();
    req.chinchayAuthorization = { };
    accessToken.addIsNotAuthenticated(req);
    const error = Middleware.getForbiddenError(req);
    assert.equal(error.chinchayCode, 'forbidden');
  });

  it('has token', async () => {
    const req = Req.generate();
    req.chinchayAuthorization = { hasToken: true };
    accessToken.addIsNotAuthenticated(req);
    const error = Middleware.getForbiddenError(req);
    assert.equal(error.chinchayCode, 'token_not_decoded');
  });

  it('has header', async () => {
    const req = Req.generate();
    req.chinchayAuthorization = { hasHeader: true };
    accessToken.addIsNotAuthenticated(req);
    const error = Middleware.getForbiddenError(req);
    assert.equal(error.chinchayCode, 'no_bearer_token');
  });
});
