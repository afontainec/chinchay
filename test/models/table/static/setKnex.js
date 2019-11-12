// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const otherKnex = require('../../../../otherKnex');
const { Table } = require('../../../..');

let Coffee = new Table('coffee', otherKnex);
const BeforeCoffee = new Table('coffee');
const ClearDB = require('../../../../db/seeds/test/00-cleardb');


// Our parent block
describe('TABLE GATEWAY: set knex', () => { // eslint-disable-line

  before(async () => { // eslint-disable-line
    await ClearDB.seed(knex);
    await ClearDB.seed(otherKnex);
    await otherKnex.migrate.latest();
  });

  it('Set knex in constructor ',  async () => { // eslint-disable-line
    const name = 'new name';
    await Coffee.save({ name });
    const results = await BeforeCoffee.find({ name });
    const otherResults = await Coffee.find({ name });
    assert.equal(results.length, 0);
    assert.equal(otherResults.length, 1);
  });

  it('does not change other instances',  async () => { // eslint-disable-line
    const NewPlace = new Table('coffee');
    const results = await NewPlace.find();
    assert.equal(results.length, 0);
  });

  it('Set knex afterwards',  async () => { // eslint-disable-line
    Coffee = new Table('coffee');
    let results = await Coffee.find();
    assert.equal(results.length, 0);
    Coffee.setKnex(otherKnex);
    results = await Coffee.find();
    assert.equal(results.length, 1);
  });

  it('does not change other instances',  async () => { // eslint-disable-line
    const NewPlace = new Table('coffee');
    const results = await NewPlace.find();
    assert.equal(results.length, 0);
  });
});
