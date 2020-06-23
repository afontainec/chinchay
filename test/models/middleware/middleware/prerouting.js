process.env.NODE_ENV = 'test';


const { assert } = require('chai');
const { thewall } = require('../../../../.chainfile');
// eslint-disable-next-line import/no-dynamic-require
const TheWall = require(thewall);
const middleware = require('../../../../models/middleware/middleware')(TheWall);


describe('Middleware: postrouting', () => { // eslint-disable-line


  it('Happy path: when dev', () => { // eslint-disable-line
    const uses = [];
    const getters = { env: 'development' };
    const enabled = {};
    const app = {
      use: (func) => { uses.push(func); },
      get: (key) => { return getters[key]; },
      enable: (key) => { enabled[key] = true; },
    };
    middleware.prerouting(app);
    assert.equal(uses.length, 2);
    assert.equal(enabled['trust proxy'], true);
  });

});
