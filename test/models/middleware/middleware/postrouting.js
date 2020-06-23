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
    const app = {
      use: (func) => { uses.push(func); },
      get: (key) => { return getters[key]; },
    };
    middleware.postrouting(app);
    assert.equal(uses.length, 3);
  });

});
