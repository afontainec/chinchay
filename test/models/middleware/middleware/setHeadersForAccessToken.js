process.env.NODE_ENV = 'test';
const codemaster = require('codemaster');
const { assert } = require('chai');
const { thewall } = require('../../../../.chainfile');

const Req = codemaster.utils.mocks.express.req;
const Res = codemaster.utils.mocks.express.res;
// eslint-disable-next-line import/no-dynamic-require
const TheWall = require(thewall);
const middleware = require('../../../../models/middleware/middleware')(TheWall);


describe('Middleware: setHeadersForAccessToken', () => { // eslint-disable-line


  it('happy path', (done) => { // eslint-disable-line
    const req = Req.generate();
    const res = Res.generate();
    middleware.setHeadersForAccessToken(req, res, () => {
      assert.equal(res.getHeader('Access-Control-Allow-Origin'), '*');
      assert.equal(res.getHeader('Access-Control-Allow-Headers'), 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      done();
    });
  });

});
