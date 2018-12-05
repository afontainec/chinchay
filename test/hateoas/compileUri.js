// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');// eslint-disable-line
const HateoasGenerator = require('../..').Hateoas;

const HATEOAS = new HateoasGenerator();

const assert = chai.assert; //eslint-disable-line


// Our parent block
describe('HATEOAS: compileUri', () => { // eslint-disable-line


  it('no values needed',  (done) => { // eslint-disable-line
    const compiled = HATEOAS.compileUri('/places');
    assert.equal(compiled, '/places');
    done();
  });

  it('Correct compile: ending',  (done) => { // eslint-disable-line
    const values = { id: 1 };
    const compiled = HATEOAS.compileUri('/places/:id', values);
    assert.equal(compiled, '/places/1');
    done();
  });

  it('Correct compile: non ending',  (done) => { // eslint-disable-line
    const values = { id: 1 };
    const compiled = HATEOAS.compileUri('/places/:id/edit', values);
    assert.equal(compiled, '/places/1/edit');
    done();
  });

  it('Correct compile: multiple values',  (done) => { // eslint-disable-line
    const values = { id: 1, name: 'places' };
    const compiled = HATEOAS.compileUri('/:name/:id/edit', values);
    assert.equal(compiled, '/places/1/edit');
    done();
  });

  it('Missing values',  (done) => { // eslint-disable-line
    const values = { id: 1 };
    const compiled = HATEOAS.compileUri('/:name/:id/edit', values);
    assert.equal(compiled, '/:name/1/edit');
    done();
  });
});
