// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const HateoasGenerator = require('../../..').Hateoas;

const HATEOAS = new HateoasGenerator();


// Our parent block
describe('HATEOAS: compileUri', () => { // eslint-disable-line


  it('no values needed',  (done) => { // eslint-disable-line
    const compiled = HATEOAS.compileUri('/coffee');
    assert.equal(compiled, '/coffee');
    done();
  });

  it('Correct compile: ending',  (done) => { // eslint-disable-line
    const values = { id: 1 };
    const compiled = HATEOAS.compileUri('/coffee/:id', values);
    assert.equal(compiled, '/coffee/1');
    done();
  });

  it('Correct compile: non ending',  (done) => { // eslint-disable-line
    const values = { id: 1 };
    const compiled = HATEOAS.compileUri('/coffee/:id/edit', values);
    assert.equal(compiled, '/coffee/1/edit');
    done();
  });

  it('Correct compile: multiple values',  (done) => { // eslint-disable-line
    const values = { id: 1, name: 'coffee' };
    const compiled = HATEOAS.compileUri('/:name/:id/edit', values);
    assert.equal(compiled, '/coffee/1/edit');
    done();
  });

  it('Missing values',  (done) => { // eslint-disable-line
    const values = { id: 1 };
    const compiled = HATEOAS.compileUri('/:name/:id/edit', values);
    assert.equal(compiled, '/:name/1/edit');
    done();
  });
});
