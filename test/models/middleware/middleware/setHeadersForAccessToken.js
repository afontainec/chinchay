process.env.NODE_ENV = 'test';
const codemaster = require('codemaster');
const { assert } = require('chai');

const Req = codemaster.utils.mocks.express.req;
const Res = codemaster.utils.mocks.express.res;
const { Middleware } = require('../../../../');


describe('Middleware: setHeadersForAccessToken', () => { // eslint-disable-line


  it('happy path', (done) => { // eslint-disable-line
    const req = Req.generate();
    const res = Res.generate();
    Middleware.setHeadersForAccessToken(req, res, () => {
      assert.equal(res.getHeader('Access-Control-Allow-Origin'), '*');
      assert.equal(res.getHeader('Access-Control-Allow-Headers'), 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      done();
    });
  });

});
