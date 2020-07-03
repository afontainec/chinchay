process.env.NODE_ENV = 'test';


const { assert } = require('chai');
const { Middleware } = require('../../../../');


describe('Middleware: postrouting', () => { // eslint-disable-line


  it('Happy path: when dev', () => { // eslint-disable-line
    const uses = [];
    const getters = { env: 'development' };
    const app = {
      use: (func) => { uses.push(func); },
      get: (key) => { return getters[key]; },
    };
    Middleware.postrouting(app);
    assert.equal(uses.length, 3);
  });

});
