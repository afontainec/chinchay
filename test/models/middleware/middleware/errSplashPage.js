process.env.NODE_ENV = 'test';


const { assert } = require('chai');
const { Middleware } = require('../../../../');

describe('Middleware: errSplashPage', () => { // eslint-disable-line


  it('Happy path: when dev', () => { // eslint-disable-line
    const uses = [];
    const getters = { env: 'development' };
    const app = {
      use: (func) => { uses.push(func); },
      get: (key) => { return getters[key]; },
    };
    Middleware.errSplashPage(app);
    assert.equal(uses.length, 2);
  });

  it('Happy path: when not dev', () => { // eslint-disable-line
    const uses = [];
    const getters = { env: 'production' };
    const app = {
      use: (func) => { uses.push(func); },
      get: (key) => { return getters[key]; },
    };
    Middleware.errSplashPage(app);
    assert.equal(uses.length, 1);
  });

});
