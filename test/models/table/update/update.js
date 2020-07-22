/* global it, before, describe */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const Utils = require('codemaster').utils;

const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: update', () => { // eslint-disable-line max-lines-per-function

  before(async () => {
    await knex.seed.run();
  });

  it('given id differ', (done) => {
    const entry = {};
    entry.id = 2;
    Coffee.update(1, entry).then(() => {
      done(new Error('Should not get here'));
    }).catch(() => {
      done();
    });
  });

  it('update entry', async () => {
    const entry = await Coffee.findById(1);
    entry.name = 'updated';
    await Coffee.update(1, Utils.cloneJSON(entry));
    const updated = await Coffee.findById(1);
    assert.equal(entry.created_at.toString(), updated.created_at.toString());
    assert.equal(entry.id, updated.id);
    assert.equal(entry.name, updated.name);
    assert.equal(entry.price, updated.price);
    assert.notEqual(entry.updated_at.toString(), updated.updated_at.toString());
  });

  it('update entry', async () => {
    const entry = await Coffee.findById(1);
    entry.name = 'updated';
    const updated = await Coffee.update(1, Utils.cloneJSON(entry));
    assert.equal(updated.name, 'updated');
  });


  it('update entry, without givin the id', async () => {
    const entry = {};
    entry.name = 'updated twice';
    await Coffee.update(1, Utils.cloneJSON(entry));
    const updated = await Coffee.findById(1);
    assert.equal(entry.name, updated.name);
  });

  it('updates updated_at', async () => {
    const entry = await Coffee.findById(1);
    entry.name = 'updated';
    await Coffee.update(1, Utils.cloneJSON(entry));
    const updated = await Coffee.findById(1);
    assert.isBelow(new Date(entry.updated_at).getTime(), new Date(updated.updated_at).getTime());
  });

  it('unexistant entry', (done) => {
    const entry = {};
    entry.id = -3;
    Coffee.update(-3, entry).then(() => {
      done(new Error('Should not get here'));
    }).catch(() => {
      done();
    });
  });

  it('update unexistant property', (done) => {
    const entry = {};
    entry.other = 'does not exists';
    Coffee.update(1, entry).then(() => {
      done(new Error('Should not get here'));
    }).catch(() => {
      done();
    });
  });

  it('id is null', (done) => {
    const entry = {};
    Coffee.update(null, entry).then(() => {
      done(new Error('Should not get here'));
    }).catch(() => {
      done();
    });
  });

  it('attributes is null', (done) => {
    const entry = {};
    entry.id = 1;
    Coffee.update(1, null).then(() => {
      done(new Error('Should not get here'));
    }).catch(() => {
      done();
    });
  });

  it('update several: return array', async () => {
    const entry = { name: 'update several' };
    const search = { id: ['in', [1, 2]] };
    const result = await Coffee.update(search, entry);
    assert.isArray(result);
    assert.equal(result.length, 2);
    assert.equal(result[0].name, 'update several');
    assert.equal(result[1].name, 'update several');
  });

  it('update only one: return object', async () => {
    const entry = { name: 'update one' };
    const result = await Coffee.update(1, entry);
    assert.isNotArray(result);
    assert.equal(result.name, 'update one');
  });

  it('returnAsQuery is defined', async () => {
    const entry = { name: 'update several' };
    const search = { id: ['in', [1, 2]] };
    const result = Coffee.update(search, entry, { returnAsQuery: true });
    const query = result.toString();
    assert.isTrue(query.startsWith('update '), `'${query}' is not a psql query`);
  });
});
