/* global describe, it, before */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../knex');
const Coffee = require('../../../models/coffee-example');
const samples = require('../../../db/seeds/test/coffee/samples');

const firstDate = new Date('1990-06-06 13:00:00.000-00');

// Our parent block
describe('TABLE GATEWAY: parseToSend', () => { // eslint-disable-line max-lines-per-function

  before(async () => {
    await knex.seed.run();
    const entry = { name: 'first', created_at: firstDate };
    await knex('coffee').insert(entry);
  });


  it('Happy path', async () => {
    const result = await Coffee.getFirstDate();
    assert.closeTo(new Date(result).getTime(), firstDate.getTime(), 100);
  });

  it('With query', async () => {
    const [,, entry] = samples;
    const { name } = entry;
    const date = entry.created_at;
    const query = { name };
    const result = await Coffee.getFirstDate(query);
    assert.closeTo(new Date(result).getTime(), new Date(date).getTime(), 100);

  });

  it('no results', async () => {
    const result = await Coffee.getFirstDate({ name: 'non existant' });
    assert.notExists(result);

  });

  it('no results.created_at', async () => {
    await knex('coffee').update({ created_at: null });
    const result = await Coffee.getFirstDate();
    assert.notExists(result);
  });

  it('Error', (done) => {
    Coffee.getFirstDate({ nonexistant: 'nonexistant' }).then(() => {
      done(new Error('Should not get here'));
    }).catch(() => {
      done();
    });
  });
});
