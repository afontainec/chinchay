// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');  // eslint-disable-line
const knex = require('../knex');
const otherKnex = require('../otherKnex');
const Table = require('..').Table;

let Places = new Table('places', otherKnex);
const BeforePlaces = new Table('places');
const ClearDB = require('../db/seeds/test/00-cleardb');


const assert = chai.assert; //eslint-disable-line


// Our parent block
describe('TABLE GATEWAY: set knex', () => { // eslint-disable-line

  before(async () => { // eslint-disable-line
    console.log('a');
    await ClearDB.seed(knex);
    console.log('aa');
    await ClearDB.seed(otherKnex);
    console.log('vamos aca');
  });

  it('Set knex in constructor ',  async () => { // eslint-disable-line
    const name = 'new name';
    await Places.save({ name });
    const results = await BeforePlaces.find({ name });
    const otherResults = await Places.find({ name });
    assert.equal(results.length, 0);
    assert.equal(otherResults.length, 1);
  });

  it('does not change other instances',  async () => { // eslint-disable-line
    const NewPlace = new Table('places');
    const results = await NewPlace.find();
    assert.equal(results.length, 0);
  });

  it('Set knex afterwards',  async () => { // eslint-disable-line
    Places = new Table('places');
    let results = await Places.find();
    assert.equal(results.length, 0);
    Places.setKnex(otherKnex);
    results = await Places.find();
    assert.equal(results.length, 1);
  });

  it('does not change other instances',  async () => { // eslint-disable-line
    const NewPlace = new Table('places');
    const results = await NewPlace.find();
    assert.equal(results.length, 0);
  });
});
