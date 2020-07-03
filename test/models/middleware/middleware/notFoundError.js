process.env.NODE_ENV = 'test';

const codemaster = require('codemaster');

const Req = codemaster.utils.mocks.express.req;
const Res = codemaster.utils.mocks.express.res;
const { assert } = require('chai');
const { Middleware } = require('../../../../');

describe('Middleware: notFoundError', () => { // eslint-disable-line


  it('happy path', (done) => { // eslint-disable-line
    const req = Req.generate();
    const res = Res.generate();
    Middleware.notFoundError(req, res, (err) => {
      assert.equal(err.message, 'Not Found');
      assert.equal(err.status, 404);
      done();
    });
  });
});
