/* global describe, it, before, after */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: saveQuery', () => { // eslint-disable-line max-lines-per-function

  before(async () => {
    await knex.seed.run();
    await Coffee.delete({});
    await knex.raw('alter table coffee add constraint unique_name unique (name);');

  });

  after(async () => {
    await knex.raw('alter table coffee drop constraint unique_name;');
  });

  it('onConflict and merge', async () => {
    const entry = { name: 'Test', price: 100 };
    const onConflict = { columns: ['name'], merge: { price: knex.raw('coffee.price + EXCLUDED.price') } };
    const options = { onConflict };
    const query = Coffee.saveQuery(entry, options);
    const expected = 'insert into "coffee" ("name", "price") values (\'Test\', 100) on conflict ("name") do update set "price" = coffee.price + EXCLUDED.price returning *';
    assert.equal(query.toString(), expected);
  });

  it('onConflict and ignore', async () => {
    const entry = { name: 'Test', price: 100 };
    const onConflict = { columns: ['name'], ignore: true };
    const options = { onConflict };
    const query = Coffee.saveQuery(entry, options);
    const expected = 'insert into "coffee" ("name", "price") values (\'Test\', 100) on conflict ("name") do nothing returning *';
    assert.equal(query.toString(), expected);
  });

  it('onConflict but columns not defined', async () => {
    const entry = { name: 'Test', price: 100 };
    const onConflict = { ignore: true };
    const options = { onConflict };
    try {
      Coffee.saveQuery(entry, options);
      throw new Error();
    } catch (err) {
      assert.equal(err.chinchayCode, 'onConflictColumns');

    }
  });

  it('no onConflict', async () => {
    const entry = { name: 'Test', price: 100 };
    const options = { };
    const query = Coffee.saveQuery(entry, options);
    const expected = 'insert into "coffee" ("name", "price") values (\'Test\', 100) returning *';
    assert.equal(query.toString(), expected);
  });

  it('no options', async () => {
    const entry = { name: 'Test', price: 100 };
    const query = Coffee.saveQuery(entry);
    const expected = 'insert into "coffee" ("name", "price") values (\'Test\', 100) returning *';
    assert.equal(query.toString(), expected);
  });

  it('functional test', async () => {
    const entry = { name: 'Test', price: 100 };
    const onConflict = { columns: ['name'], merge: { price: knex.raw('coffee.price + EXCLUDED.price') } };
    const options = { onConflict };
    const [first] = await Coffee.saveQuery(entry, options);
    const [second] = await Coffee.saveQuery(entry, options);
    assert.equal(first.id, second.id);
    assert.equal(first.price, 100);
    assert.equal(second.price, 200);
  });


});
