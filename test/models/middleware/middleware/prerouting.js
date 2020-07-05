process.env.NODE_ENV = 'test';


const { assert } = require('chai');
const { Middleware } = require('../../../../');

describe('Middleware: prerouting', () => { // eslint-disable-line


  it('Happy path: when dev', () => { // eslint-disable-line
    const uses = [];
    const getters = { env: 'development' };
    const enabled = {};
    const app = {
      use: (func) => { uses.push(func); },
      get: (key) => { return getters[key]; },
      enable: (key) => { enabled[key] = true; },
    };
    Middleware.prerouting(app);
    assert.equal(uses.length, 2);
    assert.exists(uses[0]);
    assert.exists(uses[1]);
    assert.equal(enabled['trust proxy'], true);
  });

});
