// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: delete', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('With valid id', async () => { // eslint-disable-line
    const all = await Coffee.count();
    const deleted = await Coffee.delete(1);
    const results = await Coffee.count();
    assert.equal(results, all - 1);
    assert.isNotArray(deleted);
    assert.equal(deleted.id, 1);
  });

  it('With search as object', async () => { // eslint-disable-line
    await Coffee.save([{ price: 15 }, { price: 10 }]);
    const all = await Coffee.count();
    const deleted = await Coffee.delete({ price: ['<', 105] });
    const results = await Coffee.count();
    assert.equal(results, all - 3);
    assert.isArray(deleted);
    assert.equal(deleted.length, 3);
  });

  it('returnAsQuery', async () => { // eslint-disable-line
    const query = Coffee.delete({ id: 1 }, { returnAsQuery: true });
    assert.equal(query.toString(), 'delete from "coffee" where "id" = 1 returning *');
  });

  describe('Malicious happy path', () => { // eslint-disable-line
    before(async () => { // eslint-disable-line
      await knex.seed.run();
    });

    it('With undefined id', (done) => { // eslint-disable-line
      Coffee.delete().then(() => {
        done('SHOULD NOT GET HERE');
      }).catch(() => {
        done();
      });
    });

    it('There is no entry that matches that query', async () => { // eslint-disable-line
      const all = await Coffee.count();
      await Coffee.delete(-8);
      const results = await Coffee.count();
      assert.equal(results, all);
    });
  });
});
