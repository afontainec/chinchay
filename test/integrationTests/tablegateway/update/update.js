// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai'); // eslint-disable-line
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');
const Utils = require('codemaster').utils;

const assert = chai.assert; //eslint-disable-line


// Our parent block
describe('TABLE GATEWAY: update', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('given id differ', (done) => { // eslint-disable-line
    const entry = {};
    entry.id = 2;
    Coffee.update(1, entry).then(() => {
      done(new Error('Should not get here'));
    }).catch(() => {
      done();
    });
  });

  it('update entry', async () => { // eslint-disable-line
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


  it('update entry, without givin the id', async () => { // eslint-disable-line
    const entry = {};
    entry.name = 'updated twice';
    await Coffee.update(1, Utils.cloneJSON(entry));
    const updated = await Coffee.findById(1);
    assert.equal(entry.name, updated.name);
  });

  it('updates updated_at', async () => { // eslint-disable-line
    const entry = await Coffee.findById(1);
    entry.name = 'updated';
    await Coffee.update(1, Utils.cloneJSON(entry));
    const updated = await Coffee.findById(1);
    assert.isBelow(new Date(entry.updated_at).getTime(), new Date(updated.updated_at).getTime());
  });

  it('unexistant entry', (done) => { // eslint-disable-line
    const entry = {};
    entry.id = -3;
    Coffee.update(-3, entry).then(() => {
      done(new Error('Should not get here'));
    }).catch(() => {
      done();
    });
  });

  it('update unexistant property', (done) => { // eslint-disable-line
    const entry = {};
    entry.other = 'does not exists';
    Coffee.update(1, entry).then(() => {
      done(new Error('Should not get here'));
    }).catch(() => {
      done();
    });
  });

  it('id is null', (done) => { // eslint-disable-line
    const entry = {};
    Coffee.update(null, entry).then(() => {
      done(new Error('Should not get here'));
    }).catch(() => {
      done();
    });
  });

  it('attributes is null', (done) => { // eslint-disable-line
    const entry = {};
    entry.id = 1;
    Coffee.update(1, null).then(() => {
      done(new Error('Should not get here'));
    }).catch(() => {
      done();
    });
  });
});
