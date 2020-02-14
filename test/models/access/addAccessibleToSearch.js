process.env.NODE_ENV = 'test';
const { assert } = require('chai');

const { Access } = require('../../../index');


describe('MODELS: Access addAccessibleToSearch', () => { // eslint-disable-line
  it('has Access to all', (done) => { // eslint-disable-line
    let search = { place_id: 23 };
    const access = [{ role: 'admin' }];
    const tableName = 'places';
    const key = 'place_id';
    const expected = { place_id: 23 };
    search = Access.addAccessibleToSearch(search, access, tableName, key);
    assert.deepEqual(search, expected);
    done();
  });

  it('search[key] is undef', (done) => { // eslint-disable-line
    const access = [{ role: 'venueOwner', filter: 1 }, { role: 'venueOwner', filter: 2 }];
    const tableName = 'places';
    const key = 'place_id';
    const expected = { place_id: ['in', [1, 2]] };
    const search = Access.addAccessibleToSearch(null, access, tableName, key);
    assert.deepEqual(search, expected);
    done();
  });

  it('search has key defined and is in array', (done) => { // eslint-disable-line
    let search = { place_id: 2 };
    const access = [{ role: 'venueOwner', filter: 1 }, { role: 'venueOwner', filter: 2 }];
    const tableName = 'places';
    const key = 'place_id';
    const expected = { place_id: 2 };
    search = Access.addAccessibleToSearch(search, access, tableName, key);
    assert.deepEqual(search, expected);
    done();
  });

  it('search has key defined and is not in array', (done) => { // eslint-disable-line
    let search = { place_id: 23 };
    const access = [{ role: 'venueOwner', filter: '1' }, { role: 'venueOwner', filter: '2' }];
    const tableName = 'places';
    const key = 'place_id';
    const expected = { place_id: ['in', []] };
    search = Access.addAccessibleToSearch(search, access, tableName, key);
    assert.deepEqual(search, expected);
    done();
  });

  it('search has key defined as [in, [...]]', (done) => { // eslint-disable-line
    let search = { place_id: ['in', [1, 2, 3]] };
    const access = [{ role: 'venueOwner', filter: '1' }, { role: 'venueOwner', filter: '2' }];
    const tableName = 'places';
    const key = 'place_id';
    const expected = { place_id: ['in', [1, 2]] };
    search = Access.addAccessibleToSearch(search, access, tableName, key);
    assert.deepEqual(search, expected);
    done();
  });
});
