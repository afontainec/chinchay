// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const HateoasGenerator = require('../../..').Hateoas;

const HATEOAS = new HateoasGenerator();


// Our parent block
describe('HATEOAS: get', () => { // eslint-disable-line

  it('empty',  (done) => { // eslint-disable-line
    const array = HATEOAS.get();
    assert.isArray(array);
    assert.equal(array.length, 0);
    done();
  });

  it('add Link and get correct',  (done) => { // eslint-disable-line
    HATEOAS.addLink('index', '/coffee', 'GET');
    HATEOAS.addLink('otherindex', '/coffee');
    const array = HATEOAS.get();
    assert.isArray(array);
    assert.equal(array.length, 2);
    assert.equal(array[0].rel, 'index');
    assert.equal(array[0].href, '/coffee');
    assert.equal(array[0].type, 'GET');
    assert.equal(array[1].rel, 'otherindex');
    assert.equal(array[1].href, '/coffee');
    assert.equal(array[1].type, 'GET');
    done();
  });

  it('remove link',  (done) => { // eslint-disable-line
    HATEOAS.removeLink('otherindex');
    const array = HATEOAS.get();
    assert.isArray(array);
    assert.equal(array.length, 1);
    assert.equal(array[0].rel, 'index');
    assert.equal(array[0].href, '/coffee');
    assert.equal(array[0].type, 'GET');
    done();
  });

  it('remove link again, all good',  (done) => { // eslint-disable-line
    HATEOAS.removeLink('otherindex');
    const array = HATEOAS.get();
    assert.isArray(array);
    assert.equal(array.length, 1);
    assert.equal(array[0].rel, 'index');
    assert.equal(array[0].href, '/coffee');
    assert.equal(array[0].type, 'GET');
    done();
  });

  it('override link',  (done) => { // eslint-disable-line
    HATEOAS.addLink('index', '/api/coffee');
    const array = HATEOAS.get();
    assert.isArray(array);
    assert.equal(array.length, 1);
    assert.equal(array[0].rel, 'index');
    assert.equal(array[0].href, '/api/coffee');
    assert.equal(array[0].type, 'GET');
    done();
  });

  it('override link',  (done) => { // eslint-disable-line
    HATEOAS.addLink('self', '/api/coffee/:id');
    const array = HATEOAS.get({ id: 1 });
    assert.isArray(array);
    assert.equal(array.length, 2);
    assert.equal(array[0].rel, 'index');
    assert.equal(array[0].href, '/api/coffee');
    assert.equal(array[0].type, 'GET');
    assert.equal(array[1].rel, 'self');
    assert.equal(array[1].href, '/api/coffee/1');
    assert.equal(array[1].type, 'GET');
    done();
  });
});
