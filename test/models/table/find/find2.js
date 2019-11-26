// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const knex = require('../../../../knex');
const Coffee = require('../../../../models/coffee-example');


// Our parent block
describe('TABLE GATEWAY: FIND', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('Empty query', async () => { // eslint-disable-line
    const results = await Coffee.find({});
    assert.equal(results.length, 4);
  });

  it('With query', async () => { // eslint-disable-line
    const results = await Coffee.find({
      price: 100,
    });
    assert.equal(results.length, 2);
    for (let i = 0; i < results.length; i++) {
      assert.equal(results[i].price, 100);
    }
  });

  it('With columns', async () => { // eslint-disable-line
    const results = await Coffee.find({}, ['id', 'name']);
    assert.equal(results.length, 4);
    for (let i = 0; i < results.length; i++) {
      const keys = Object.keys(results[i]);
      assert.equal(keys.length, 2);
      assert.isTrue(keys.indexOf('id') > -1);
      assert.isTrue(keys.indexOf('name') > -1);
    }
  });

  it('With columns = all', async () => { // eslint-disable-line
    const results = await Coffee.find({}, 'all');
    assert.equal(results.length, 4);
    for (let i = 0; i < results.length; i++) {
      const keys = Object.keys(results[i]);
      assert.equal(keys.length, 5);
    }
  });
});

describe('Malicious happy path', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('Query is undefined', async () => { // eslint-disable-line
    const results = await Coffee.find();
    assert.equal(results.length, 4);
  });

  it('Query is not a valid json', async () => { // eslint-disable-line
    const results = await Coffee.find();
    assert.equal(results.length, 4);
  });

  it('Query with invalid attr', (done) => { // eslint-disable-line
    Coffee.find({
      invalid: 'ues',
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage.routine, 'errorMissingColumn');
      done();
    });
  });

  it('Columns with invalid column name', (done) => { // eslint-disable-line
    Coffee.find({}, ['all']).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage.routine, 'errorMissingColumn');
      done();
    });
  });

  it('Columns invalid json', async () => { // eslint-disable-line
    const results = await Coffee.find({}, {
      look: 'to me',
    });
    assert.equal(results.length, 4);
    for (let i = 0; i < results.length; i++) {
      const keys = Object.keys(results[i]);
      assert.equal(keys.length, 5);
    }
  });
});

describe('with advance settings: group by', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  // cannot do a group by
  it('Give group by', (done) => { // eslint-disable-line
    Coffee.find({}, 'all', {
      groupBy: 'name',
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage.routine, 'check_ungrouped_columns_walker');
      done();
    });
  });

  it('invalid group by', (done) => { // eslint-disable-line
    Coffee.find({}, 'all', {
      groupBy: 'unexistant',
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage.routine, 'errorMissingColumn');
      done();
    });
  });
});

describe('with advance settings: order by', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });
  it('With order by', async () => { // eslint-disable-line
    const results = await Coffee.find({}, 'all', {
      orderBy: ['created_at', 'desc'],
    });
    assert.equal(results.length, 4);
    for (let i = 1; i < results.length; i++) {
      assert.isTrue(results[i - 1].created_at >= results[i].created_at);
    }
  });

  it('With invalid order by', (done) => { // eslint-disable-line
    Coffee.find({}, 'all', {
      orderBy: ['unexistant', 'asc'],
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage.routine, 'errorMissingColumn');
      done();
    });
  });

  // orders as asc was given
  it('With invalid order by: no desc or asc given', async () => { // eslint-disable-line
    const results = await Coffee.find({}, 'all', {
      orderBy: ['created_at'],
    });
    assert.equal(results.length, 4);
    for (let i = 1; i < results.length; i++) {
      assert.isTrue(results[i - 1].created_at <= results[i].created_at);
    }
  });

  // orders as asc was given
  it('With invalid order by: given as string', async () => { // eslint-disable-line
    const results = await Coffee.find({}, 'all', {
      orderBy: 'created_at',
    });
    assert.equal(results.length, 4);
    for (let i = 1; i < results.length; i++) {
      assert.isTrue(results[i - 1].created_at <= results[i].created_at);
    }
  });

  // orders as asc was given
  it('With invalid order by: nor asc nor desc', async () => { // eslint-disable-line
    const results = await Coffee.find({}, 'all', {
      orderBy: ['created_at', 'not valid'],
    });
    assert.equal(results.length, 4);
    for (let i = 1; i < results.length; i++) {
      assert.isTrue(results[i - 1].created_at <= results[i].created_at);
    }
  });
});

describe('with advance settings: start_date and end_date', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('With start date', async () => { // eslint-disable-line
    const date = new Date('2018-11-21T12:06:00.000Z');
    const results = await Coffee.find({}, 'all', {
      startDate: date,
    });
    assert.equal(results.length, 2);
    for (let i = 0; i < results.length; i++) {
      assert.isTrue(results[i].created_at > date);
    }
  });

  it('With end date', async () => { // eslint-disable-line
    const date = new Date('2018-11-21T12:06:10.000Z');
    const results = await Coffee.find({}, 'all', {
      endDate: date,
    });
    assert.equal(results.length, 3);
    for (let i = 0; i < results.length; i++) {
      assert.isTrue(results[i].created_at < date);
    }
  });

  it('With start day and end date', async () => { // eslint-disable-line
    const startDate = new Date('2018-11-21T11:55:55.000Z');
    const endDate = new Date('2018-11-21T12:06:10.000Z');
    const results = await Coffee.find({}, 'all', {
      endDate,
      startDate,
    });
    assert.equal(results.length, 2);
    for (let i = 0; i < results.length; i++) {
      assert.isTrue(results[i].created_at < endDate);
      assert.isTrue(results[i].created_at > startDate);
    }
  });

  it('invalid start date', (done) => { // eslint-disable-line
    const date = 'this is not a date';
    Coffee.find({}, 'all', {
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

describe('with advance settings: offset', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('with limit', async () => { // eslint-disable-line
    const results = await Coffee.find({}, 'all', {
      limit: 2,
    });
    assert.equal(results.length, 2);
  });

  // as if no limit was given
  it('with invalid limit', async () => { // eslint-disable-line
    const results = await Coffee.find({}, 'all', {
      limit: 'yes',
    });
    assert.equal(results.length, 4);
  });

  // as if no limit was given
  it('with invalid limit: negative value', (done) => { // eslint-disable-line
    Coffee.find({}, 'all', {
      limit: -1,
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage.routine, 'recompute_limits');
      done();
    });
  });

  it('with offset', async () => { // eslint-disable-line
    const results = await Coffee.find({}, 'all', {
      offset: 1,
    });
    assert.equal(results.length, 3);
  });

  it('with invalid offset', (done) => { // eslint-disable-line
    Coffee.find({}, 'all', {
      offset: -1,
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage.routine, 'recompute_limits');
      done();
    });
  });
});

describe('with advance settings: raw select', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('with rawSelect', async () => { // eslint-disable-line
    const results = await Coffee.find({}, 'all', {
      rawSelect: 'EXTRACT(doy from created_at) as date',
    });
    assert.equal(results.length, 4);
    for (let i = 0; i < results.length; i++) {
      const keys = Object.keys(results[i]);
      assert.isTrue(keys.length > 1);
      assert.isTrue(keys.indexOf('date') > -1);
    }
  });

  it('with rawSelect && columns == undefined', async () => { // eslint-disable-line
    const results = await Coffee.find({}, undefined, {
      rawSelect: 'EXTRACT(doy from created_at) as date',
    });
    assert.equal(results.length, 4);
    for (let i = 0; i < results.length; i++) {
      const keys = Object.keys(results[i]);
      assert.isTrue(keys.length === 1);
      assert.isTrue(keys.indexOf('date') > -1);
    }
  });

  it('with rawSelect && columns == ["id", "name"]', async () => { // eslint-disable-line
    const results = await Coffee.find({}, ['id', 'name'], {
      rawSelect: 'EXTRACT(doy from created_at) as date',
    });
    assert.equal(results.length, 4);
    for (let i = 0; i < results.length; i++) {
      const keys = Object.keys(results[i]);
      assert.isTrue(keys.length === 3);
      assert.isTrue(keys.indexOf('date') > -1);
    }
  });

  it('with rawSelect && columns == ["id", "name"] && clearSelect', async () => { // eslint-disable-line
    const results = await Coffee.find({}, ['id', 'name'], {
      clearSelect: true,
      rawSelect: 'EXTRACT(doy from created_at) as date',
    });
    assert.equal(results.length, 4);
    for (let i = 0; i < results.length; i++) {
      const keys = Object.keys(results[i]);
      assert.isTrue(keys.length === 1);
      assert.isTrue(keys.indexOf('date') > -1);
    }
  });

  it('with invalid rawSelect', (done) => { // eslint-disable-line
    Coffee.find({}, 'all', {
      rawSelect: 'this should fail',
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage.routine, 'scanner_yyerror');
      done();
    });
  });
});
