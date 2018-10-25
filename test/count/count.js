// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const knex = require('../../knex');
const Places = require('../../models/places-example');


const assert = chai.assert; //eslint-disable-line


// Our parent block
describe('TABLE GATEWAY: count', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('Empty query', async () => { // eslint-disable-line
    const results = await Places.count({});
    assert.equal(results, 4);
  });

  it('With query', async () => { // eslint-disable-line
    const results = await Places.count({
      is_active: true,
    });
    assert.equal(results, 3);
  });
});

describe('Malicious happy path', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('Query is undefined', async () => { // eslint-disable-line
    const results = await Places.count();
    assert.equal(results, 4);
  });

  it('Query is not a valid json', async () => { // eslint-disable-line
    const results = await Places.count('something wierd');
    assert.equal(results, 4);
  });

  it('Query with invalid attr', (done) => { // eslint-disable-line
    Places.count({
      invalid: 'ues',
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage, 'errorMissingColumn');
      done();
    });
  });
});

describe('with advance settings: group by', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('Give group by', async () => { // eslint-disable-line
    const places = await Places.count({}, {
      groupBy: 'is_active',
    });
    assert.equal(places.length, 2);
    for (let i = 0; i < places.length; i++) {
      const keys = Object.keys(places[i]);
      assert.isTrue(keys.indexOf('is_active') > -1);
      assert.isTrue(keys.indexOf('count') > -1);
      const c = places[i].is_active ? 3 : 1;
      assert.equal(places[i].count, c);
    }
  });

  it('invalid group by', (done) => { // eslint-disable-line
    Places.count({}, {
      groupBy: 'unexistant',
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage, 'errorMissingColumn');
      done();
    });
  });

  // cannot do a group by
  it('Give a complex group by', async () => { // eslint-disable-line
    const places = await Places.count({}, {
      rawSelect: '(created_at)::DATE as d',
      groupBy: 'd',
    });
    assert.equal(places.length, 4);
    for (let i = 0; i < places.length; i++) {
      const keys = Object.keys(places[i]);
      assert.isTrue(keys.indexOf('d') > -1);
      assert.isTrue(keys.indexOf('count') > -1);
      assert.equal(places[i].count, 1);
    }
  });
});

describe('with advance settings: order by', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });
  it('With order by', async () => { // eslint-disable-line
    const results = await Places.count({}, {
      groupBy: 'is_active',
      orderBy: ['count', 'desc'],
    });
    assert.equal(results.length, 2);
    for (let i = 1; i < results.length; i++) {
      assert.isTrue(results[i - 1].count >= results[i].count);
    }
  });

  it('With invalid order by', (done) => { // eslint-disable-line
    Places.count({}, {
      orderBy: ['daily_visits', 'asc'],
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage, 'check_ungrouped_columns_walker');
      done();
    });
  });

  describe('with advance settings: start_date and end_date', () => { // eslint-disable-line
    before(async () => { // eslint-disable-line
      await knex.seed.run();
    });

    it('With start date', async () => { // eslint-disable-line
      const date = new Date(new Date().getTime() - (3 * 24 * 60 * 60 * 1000));
      const results = await Places.count({}, {
        startDate: date,
      });
      assert.equal(results, 2);
    });

    it('With end date', async () => { // eslint-disable-line
      const date = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
      const results = await Places.count({}, {
        endDate: date,
      });
      assert.equal(results, 3);
    });

    it('With start day and end date', async () => { // eslint-disable-line
      const startDate = new Date(new Date().getTime() - (5 * 24 * 60 * 60 * 1000));
      const endDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
      const results = await Places.count({}, {
        endDate,
        startDate,
      });
      assert.equal(results.length, 1);
    });

    it('invalid start date', (done) => { // eslint-disable-line
      const date = 'this is not a date';
      Places.count({}, {
        startDate: date,
      }).then(() => {
        done('SHOULD NOT GET HERE');
      }).catch((err) => {
        assert.equal(err.code, 400);
        assert.equal(err.fullMessage, 'DateTimeParseError');
        done();
      });
    });
  });
});
