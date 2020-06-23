process.env.NODE_ENV = 'test';

const codemaster = require('codemaster');

const Req = codemaster.utils.mocks.express.req;
const Res = codemaster.utils.mocks.express.res;
const { assert } = require('chai');
const { thewall } = require('../../../../.chainfile');
// eslint-disable-next-line import/no-dynamic-require
const TheWall = require(thewall);
const middleware = require('../../../../models/middleware/middleware')(TheWall);


describe('Middleware: errorSplashWithError', () => { // eslint-disable-line


  it('Happy path (err.status is defined)', () => { // eslint-disable-line
    const req = new Req();
    const res = new Res();
    const err = { status: 401, message: 'message' };
    middleware.errorSplashWithError(err, req, res);
    assert.equal(res.jsonKey, 'error');
    assert.equal(res.sending.message, err.message);
    assert.equal(res.sending.error, err);
    assert.equal(res.statusToSend, 401);
  });

  it('err.status is not defined', () => { // eslint-disable-line
    const req = Req.generate();
    const res = Res.generate();
    const err = { };
    middleware.errorSplashWithError(err, req, res);
    assert.equal(res.statusToSend, 500);
  });
});
