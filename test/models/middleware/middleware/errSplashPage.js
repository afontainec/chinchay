process.env.NODE_ENV = 'test';

const codemaster = require('codemaster');

const Req = codemaster.utils.mocks.express.req;
const Res = codemaster.utils.mocks.express.res;
const { assert } = require('chai');
const { thewall } = require('../../../../.chainfile');
// eslint-disable-next-line import/no-dynamic-require
const TheWall = require(thewall);
const middleware = require('../../../../models/middleware/middleware')(TheWall);


describe('Middleware: errSplashPage', () => { // eslint-disable-line


  it('Happy path: when dev', () => { // eslint-disable-line
    const uses = [];
    const getters = { env: 'development' };
    const app = {
      use: (func) => { uses.push(func); },
      get: (key) => { return getters[key]; },
    };
    middleware.errSplashPage(app);
    assert.equal(uses.length, 2);
  });

  it('Happy path: when not dev', () => { // eslint-disable-line
    const uses = [];
    const getters = { env: 'production' };
    const app = {
      use: (func) => { uses.push(func); },
      get: (key) => { return getters[key]; },
    };
    middleware.errSplashPage(app);
    assert.equal(uses.length, 1);
  });

});
