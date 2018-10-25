// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const knex = require('../../../../knex');
const Places = require('../../../../services/models/tableGateway/example/places');


const assert = chai.assert; //eslint-disable-line


// Our parent block
describe('TABLE GATEWAY: FIND', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('Empty query', async () => { // eslint-disable-line
    const results = await Places.find({});
    assert.equal(results.length, 4);
  });

  it('With query', async () => { // eslint-disable-line
    const results = await Places.find({
      is_active: true,
    });
    assert.equal(results.length, 3);
    for (let i = 0; i < results.length; i++) {
      assert.isTrue(results[i].is_active);
    }
  });

  it('With columns', async () => { // eslint-disable-line
    const results = await Places.find({}, ['id', 'name']);
    assert.equal(results.length, 4);
    for (let i = 0; i < results.length; i++) {
      const keys = Object.keys(results[i]);
      assert.equal(keys.length, 2);
      assert.isTrue(keys.indexOf('id') > -1);
      assert.isTrue(keys.indexOf('name') > -1);
    }
  });

  it('With columns = all', async () => { // eslint-disable-line
    const results = await Places.find({}, 'all');
    assert.equal(results.length, 4);
    for (let i = 0; i < results.length; i++) {
      const keys = Object.keys(results[i]);
      assert.equal(keys.length, 20);
    }
  });
});

describe('Malicious happy path', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('Query is undefined', async () => { // eslint-disable-line
    const results = await Places.find();
    assert.equal(results.length, 4);
  });

  it('Query is not a valid json', async () => { // eslint-disable-line
    const results = await Places.find();
    assert.equal(results.length, 4);
  });

  it('Query with invalid attr', (done) => { // eslint-disable-line
    Places.find({
      invalid: 'ues',
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage, 'errorMissingColumn');
      done();
    });
  });

  it('Columns with invalid column name', (done) => { // eslint-disable-line
    Places.find({}, ['all']).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage, 'errorMissingColumn');
      done();
    });
  });

  it('Columns invalid json', async () => { // eslint-disable-line
    const results = await Places.find({}, {
      look: 'to me',
    });
    assert.equal(results.length, 4);
    for (let i = 0; i < results.length; i++) {
      const keys = Object.keys(results[i]);
      assert.equal(keys.length, 20);
    }
  });
});

describe('with advance settings: group by', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  // cannot do a group by
  it('Give group by', (done) => { // eslint-disable-line
    Places.find({}, 'all', {
      groupBy: 'is_active',
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage, 'check_ungrouped_columns_walker');
      done();
    });
  });

  it('invalid group by', (done) => { // eslint-disable-line
    Places.find({}, 'all', {
      groupBy: 'unexistant',
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage, 'errorMissingColumn');
      done();
    });
  });
});

describe('with advance settings: order by', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });
  it('With order by', async () => { // eslint-disable-line
    const results = await Places.find({}, 'all', {
      orderBy: ['daily_visits', 'desc'],
    });
    assert.equal(results.length, 4);
    for (let i = 1; i < results.length; i++) {
      assert.isTrue(results[i - 1].daily_visits >= results[i].daily_visits);
    }
  });

  it('With invalid order by', (done) => { // eslint-disable-line
    Places.find({}, 'all', {
      orderBy: ['unexistant', 'asc'],
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage, 'errorMissingColumn');
      done();
    });
  });

  // orders as asc was given
  it('With invalid order by: no desc or asc given', async () => { // eslint-disable-line
    const results = await Places.find({}, 'all', {
      orderBy: ['daily_visits'],
    });
    assert.equal(results.length, 4);
    for (let i = 1; i < results.length; i++) {
      assert.isTrue(results[i - 1].daily_visits <= results[i].daily_visits);
    }
  });

  // orders as asc was given
  it('With invalid order by: given as string', async () => { // eslint-disable-line
    const results = await Places.find({}, 'all', {
      orderBy: 'daily_visits',
    });
    assert.equal(results.length, 4);
    for (let i = 1; i < results.length; i++) {
      assert.isTrue(results[i - 1].daily_visits <= results[i].daily_visits);
    }
  });

  // orders as asc was given
  it('With invalid order by: nor asc nor desc', async () => { // eslint-disable-line
    const results = await Places.find({}, 'all', {
      orderBy: ['daily_visits', 'not valid'],
    });
    assert.equal(results.length, 4);
    for (let i = 1; i < results.length; i++) {
      assert.isTrue(results[i - 1].daily_visits <= results[i].daily_visits);
    }
  });
});

describe('with advance settings: start_date and end_date', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('With start date', async () => { // eslint-disable-line
    const date = new Date(new Date().getTime() - (3 * 24 * 60 * 60 * 1000));
    const results = await Places.find({}, 'all', {
      startDate: date,
    });
    assert.equal(results.length, 2);
    for (let i = 0; i < results.length; i++) {
      assert.isTrue(results[i].created_at > date);
    }
  });

  it('With end date', async () => { // eslint-disable-line
    const date = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
    const results = await Places.find({}, 'all', {
      endDate: date,
    });
    assert.equal(results.length, 3);
    for (let i = 0; i < results.length; i++) {
      assert.isTrue(results[i].created_at < date);
    }
  });

  it('With start day and end date', async () => { // eslint-disable-line
    const startDate = new Date(new Date().getTime() - (5 * 24 * 60 * 60 * 1000));
    const endDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
    const results = await Places.find({}, 'all', {
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
    Places.find({}, 'all', {
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

describe('with advance settings: offset', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('with limit', async () => { // eslint-disable-line
    const results = await Places.find({}, 'all', {
      limit: 2,
    });
    assert.equal(results.length, 2);
  });

  // as if no limit was given
  it('with invalid limit', async () => { // eslint-disable-line
    const results = await Places.find({}, 'all', {
      limit: 'yes',
    });
    assert.equal(results.length, 4);
  });

  // as if no limit was given
  it('with invalid limit: negative value', (done) => { // eslint-disable-line
    Places.find({}, 'all', {
      limit: -1,
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage, 'recompute_limits');
      done();
    });
  });

  it('with offset', async () => { // eslint-disable-line
    const results = await Places.find({}, 'all', {
      offset: 1,
    });
    assert.equal(results.length, 3);
  });

  it('with invalid offset', (done) => { // eslint-disable-line
    Places.find({}, 'all', {
      offset: -1,
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage, 'recompute_limits');
      done();
    });
  });
});

describe('with advance settings: raw select', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex.seed.run();
  });

  it('with rawSelect', async () => { // eslint-disable-line
    const results = await Places.find({}, 'all', {
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
    const results = await Places.find({}, undefined, {
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
    const results = await Places.find({}, ['id', 'name'], {
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
    const results = await Places.find({}, ['id', 'name'], {
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
    Places.find({}, 'all', {
      rawSelect: 'this should fail',
    }).then(() => {
      done('SHOULD NOT GET HERE');
    }).catch((err) => {
      assert.equal(err.code, 400);
      assert.equal(err.fullMessage, 'scanner_yyerror');
      done();
    });
  });
});
