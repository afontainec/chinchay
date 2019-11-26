// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: count', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('Empty query', async () => { // eslint-disable-line
    const results = await Coffee.count({});
    assert.equal(results, 4);
  });

  it('With query', async () => { // eslint-disable-line
    const results = await Coffee.count({
      price: 100,
    });
    assert.equal(results, 2);
  });
});

describe('Malicious happy path', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('Query is undefined', async () => { // eslint-disable-line
    const results = await Coffee.count();
    assert.equal(results, 4);
  });

  it('Query is not a valid json', async () => { // eslint-disable-line
    const results = await Coffee.count('something wierd');
    assert.equal(results, 4);
  });

  it('Query with invalid attr', (done) => { // eslint-disable-line
    Coffee.count({
      invalid: 'ues',
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage.routine, 'errorMissingColumn');
      done();
    });
  });
});

describe('with advance settings: group by', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('Give group by', async () => { // eslint-disable-line
    const coffee = await Coffee.count({}, {
      groupBy: 'name',
    });
    assert.equal(coffee.length, 3);
    const counts = {
      'this is the name': 2,
      other: 1,
      expensive: 1,
    };
    for (let i = 0; i < coffee.length; i++) {
      const keys = Object.keys(coffee[i]);
      assert.isTrue(keys.indexOf('name') > -1);
      assert.isTrue(keys.indexOf('count') > -1);
      const c = counts[coffee[i].name];
      assert.equal(coffee[i].count, c);
    }
  });

  it('Give group by: array', async () => { // eslint-disable-line
    const coffee = await Coffee.count({}, {
      groupBy: ['price', 'id'],
    });
    assert.equal(coffee.length, 4);
    for (let i = 0; i < coffee.length; i++) {
      const keys = Object.keys(coffee[i]);
      assert.isTrue(keys.indexOf('price') > -1);
      assert.isTrue(keys.indexOf('id') > -1);
      assert.equal(coffee[i].count, 1);
    }
  });

  it('Give group by: array and complex raw select', async () => { // eslint-disable-line
    const options = {};
    options.rawSelect = 'created_at::DATE as date, EXTRACT (hour from (created_at)) as hour';
    options.groupBy = ['date', 'hour'];
    const coffee = await Coffee.count({}, options);
    assert.equal(coffee.length, 2);
    for (let i = 0; i < coffee.length; i++) {
      const keys = Object.keys(coffee[i]);
      assert.isTrue(keys.indexOf('date') > -1);
      assert.isTrue(keys.indexOf('hour') > -1);
      assert.equal(coffee[i].count, 2);
    }
  });

  it('invalid group by', (done) => { // eslint-disable-line
    Coffee.count({}, {
      groupBy: 'unexistant',
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage.routine, 'errorMissingColumn');
      done();
    });
  });

  // cannot do a group by
  it('Give a complex group by', async () => { // eslint-disable-line
    const coffee = await Coffee.count({}, {
      rawSelect: '(created_at)::DATE as d',
      groupBy: 'd',
    });
    assert.equal(coffee.length, 1);
    for (let i = 0; i < coffee.length; i++) {
      const keys = Object.keys(coffee[i]);
      assert.isTrue(keys.indexOf('d') > -1);
      assert.isTrue(keys.indexOf('count') > -1);
      assert.equal(coffee[i].count, 4);
    }
  });
});

describe('with advance settings: order by', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });
  it('With order by', async () => { // eslint-disable-line
    const results = await Coffee.count({}, {
      groupBy: 'name',
      orderBy: ['count', 'desc'],
    });
    assert.equal(results.length, 3);
    for (let i = 1; i < results.length; i++) {
      assert.isTrue(results[i - 1].count >= results[i].count);
    }
  });

  it('With invalid order by', (done) => { // eslint-disable-line
    Coffee.count({}, {
      orderBy: ['price', 'asc'],
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage.routine, 'check_ungrouped_columns_walker');
      done();
    });
  });
});

describe('with advance settings: start_date and end_date', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('With start date', async () => { // eslint-disable-line
    const date = new Date('2018-11-21T12:00:00.000Z');
    const results = await Coffee.count({}, {
      startDate: date,
    });
    assert.equal(results, 2);
  });

  it('With end date', async () => { // eslint-disable-line
    const date = new Date('2018-11-21T12:06:05.000Z');
    const results = await Coffee.count({}, {
      endDate: date,
    });
    assert.equal(results, 3);
  });

  it('With start day and end date', async () => { // eslint-disable-line
    const startDate = new Date('2018-11-21T12:00:00.000Z');
    const endDate = new Date('2018-11-21T12:06:05.000Z');
    const results = await Coffee.count({}, {
      endDate,
      startDate,
    });
    assert.equal(results.length, 1);
  });

  it('invalid start date', (done) => { // eslint-disable-line
    const date = 'this is not a date';
    Coffee.count({}, {
      startDate: date,
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage.routine, 'DateTimeParseError');
      done();
    });
  });
});

describe('with advance settings: countDistinct', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('With countDistinct', async () => { // eslint-disable-line
    const results = await Coffee.count({}, {
      countDistinct: 'name',
    });
    assert.equal(results, 3);
  });

  it('With invalid countDistinct', (done) => { // eslint-disable-line
    Coffee.count({}, {
      countDistinct: 'not a valid column',
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage.routine, 'errorMissingColumn');
      done();
    });
  });
});

describe('with advance settings: rawSelect', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('With max(created_at)', async () => { // eslint-disable-line
    const results = await Coffee.count({}, {
      rawSelect: 'max(created_at)',
    });
    const keys = Object.keys(results);
    assert.equal(keys.length, 2);
    assert.isTrue(keys.indexOf('count') > -1);
    assert.isTrue(keys.indexOf('max') > -1);
  });
});
