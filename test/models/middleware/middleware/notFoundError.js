process.env.NODE_ENV = 'test';

const codemaster = require('codemaster');

const Req = codemaster.utils.mocks.express.req;
const Res = codemaster.utils.mocks.express.res;
const { assert } = require('chai');
const { thewall } = require('../../../../.chainfile');
// eslint-disable-next-line import/no-dynamic-require
const TheWall = require(thewall);
const middleware = require('../../../../models/middleware/middleware')(TheWall);


describe('Middleware: notFoundError', () => { // eslint-disable-line


  it('happy path', (done) => { // eslint-disable-line
    const req = Req.generate();
    const res = Res.generate();
    middleware.notFoundError(req, res, (err) => {
      assert.equal(err.message, 'Not Found');
      assert.equal(err.status, 404);
      done();
    });
  });
});
