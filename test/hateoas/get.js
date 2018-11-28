// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');// eslint-disable-line
const HateoasGenerator = require('../..').Hateoas;

const HATEOAS = new HateoasGenerator();

const assert = chai.assert; //eslint-disable-line


// Our parent block
describe('HATEOAS: get', () => { // eslint-disable-line

  it('empty',  (done) => { // eslint-disable-line
    const array = HATEOAS.get();
    assert.isArray(array);
    assert.equal(array.length, 0);
    done();
  });

  it('add Link and get correct',  (done) => { // eslint-disable-line
    HATEOAS.addLink('index', '/places', 'GET');
    HATEOAS.addLink('otherindex', '/places');
    const array = HATEOAS.get();
    assert.isArray(array);
    assert.equal(array.length, 2);
    assert.equal(array[0].rel, 'index');
    assert.equal(array[0].href, '/places');
    assert.equal(array[0].type, 'GET');
    assert.equal(array[1].rel, 'otherindex');
    assert.equal(array[1].href, '/places');
    assert.equal(array[1].type, 'GET');
    done();
  });

  it('remove link',  (done) => { // eslint-disable-line
    HATEOAS.removeLink('otherindex');
    const array = HATEOAS.get();
    assert.isArray(array);
    assert.equal(array.length, 1);
    assert.equal(array[0].rel, 'index');
    assert.equal(array[0].href, '/places');
    assert.equal(array[0].type, 'GET');
    done();
  });

  it('remove link again, all good',  (done) => { // eslint-disable-line
    HATEOAS.removeLink('otherindex');
    const array = HATEOAS.get();
    assert.isArray(array);
    assert.equal(array.length, 1);
    assert.equal(array[0].rel, 'index');
    assert.equal(array[0].href, '/places');
    assert.equal(array[0].type, 'GET');
    done();
  });

  it('override link',  (done) => { // eslint-disable-line
    HATEOAS.addLink('index', '/api/places');
    const array = HATEOAS.get();
    assert.isArray(array);
    assert.equal(array.length, 1);
    assert.equal(array[0].rel, 'index');
    assert.equal(array[0].href, '/api/places');
    assert.equal(array[0].type, 'GET');
    done();
  });

  it('override link',  (done) => { // eslint-disable-line
    HATEOAS.addLink('self', '/api/places/:id');
    const array = HATEOAS.get({ id: 1 });
    assert.isArray(array);
    assert.equal(array.length, 2);
    assert.equal(array[0].rel, 'index');
    assert.equal(array[0].href, '/api/places');
    assert.equal(array[0].type, 'GET');
    assert.equal(array[1].rel, 'self');
    assert.equal(array[1].href, '/api/places/1');
    assert.equal(array[1].type, 'GET');
    done();
  });

  it('Get without id',  (done) => { // eslint-disable-line
    const array = HATEOAS.get();
    assert.notExists(array);
    done();
  });
});
