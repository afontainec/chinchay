/* global before, it, describe */
process.env.NODE_ENV = 'test';

const codemaster = require('codemaster');

const Req = codemaster.utils.mocks.express.req;
const Res = codemaster.utils.mocks.express.res;
const { assert } = require('chai');
const { thewall } = require('../../../../.chainfile');
// eslint-disable-next-line import/no-dynamic-require
const TheWall = require(thewall);
const middleware = require('../../../../models/middleware/middleware')(TheWall);
const accessToken = require('../../../../models/middleware/accessToken');


// eslint-disable-next-line max-lines-per-function
describe('Middleware: hasAccess', () => {

  before(() => {
    accessToken.bootstrap(TheWall);
  });

  it('is not authenticated', async () => {
    const req = Req.generate();
    accessToken.addIsNotAuthenticated(req);
    const res = Res.generate();
    let called = false;
    const next = () => { called = true; };
    middleware.hasAccess(req, res, next);
    assert.equal(res.statusToSend, 403);
    assert.equal(res.sendingFile.error, 'Access restricted to this data');
    assert.equal(called, false);
  });

  it('is authenticated: can go through', async () => {
    const req = Req.generate();
    accessToken.addIsNotAuthenticated(req);
    const res = Res.generate();
    let called = false;
    const next = () => { called = true; };
    middleware.hasAccess(req, res, next);
    assert.equal(res.statusToSend, 403);
    assert.equal(res.sendingFile.error, 'Access restricted to this data');
    assert.equal(called, false);
    throw new Error('NOT DONE');
  });

  it('is authenticated: can go through (fullUrl ends with /)', async () => {
    const req = Req.generate();
    accessToken.addIsNotAuthenticated(req);
    const res = Res.generate();
    let called = false;
    const next = () => { called = true; };
    middleware.hasAccess(req, res, next);
    assert.equal(res.statusToSend, 403);
    assert.equal(res.sendingFile.error, 'Access restricted to this data');
    assert.equal(called, false);
    throw new Error('NOT DONE');
  });
  it('is authenticated: cant go through', async () => {
    const req = Req.generate();
    accessToken.addIsNotAuthenticated(req);
    const res = Res.generate();
    let called = false;
    const next = () => { called = true; };
    middleware.hasAccess(req, res, next);
    assert.equal(res.statusToSend, 403);
    assert.equal(res.sendingFile.error, 'Access restricted to this data');
    assert.equal(called, false);
    throw new Error('NOT DONE');
  });
});
