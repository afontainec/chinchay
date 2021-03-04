/* global it, describe */
process.env.NODE_ENV = 'test';

const codemaster = require('codemaster');

const Req = codemaster.utils.mocks.express.req;
const { assert } = require('chai');
const { Middleware } = require('../../../..');
const accessToken = require('../../../../models/middleware/accessToken');

describe('Middleware: isAuthenticated', () => { // eslint-disable-line max-lines-per-function


  it('req.isAuthenticatedByToken not defined', async () => {
    const req = Req.generate();
    const result = Middleware.isAuthenticated(req);
    assert.equal(!!result, false);
  });

  it('is not authenticated', async () => {
    const req = Req.generate();
    accessToken.addIsNotAuthenticated(req);
    const result = Middleware.isAuthenticated(req);
    assert.equal(!!result, false);
  });

  it('req is authenticated', async () => {
    const req = Req.generate();
    accessToken.addIsAuthenticated(req, { user: 1 });
    const result = Middleware.isAuthenticated(req);
    assert.equal(!!result, true);
  });

  it('req is null', async () => {
    const result = Middleware.isAuthenticated();
    assert.equal(!!result, false);
  });
});
