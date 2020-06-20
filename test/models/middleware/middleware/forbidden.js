process.env.NODE_ENV = 'test';

const codemaster = require('codemaster');

const Req = codemaster.utils.mocks.express.req;
const Res = codemaster.utils.mocks.express.res;
const { assert } = require('chai');
const { thewall } = require('../../../../.chainfile');
// eslint-disable-next-line import/no-dynamic-require
const TheWall = require(thewall);
const middleware = require('../../../../models/middleware/middleware')(TheWall);


describe('Middleware: forbidden', () => { // eslint-disable-line


  it('happy path', async () => { // eslint-disable-line
    const req = Req.generate();
    const res = Res.generate();
    middleware.forbidden(req, res);
    assert.equal(res.statusToSend, 403);
    assert.equal(res.sendingFile.error, 'Access restricted to this data');
  });
});
