process.env.NODE_ENV = 'test';

const codemaster = require('codemaster');

const Req = codemaster.utils.mocks.express.req;
const { assert } = require('chai');
const knex = require('../../../../knex');
const accessToken = require('../../../../models/middleware/accessToken');

describe('Middleware: accessToken: addIsAuthenticated', () => { // eslint-disable-line

  // eslint-disable-next-line no-undef
  before(async () => {
    await knex.seed.run();
  });

  it('req is undef', async () => { // eslint-disable-line
    const decoded = { user: 1 };
    accessToken.addIsAuthenticated(null, decoded);
  });

  it('decoded is undef', async() => { // eslint-disable-line
    const req = Req.generate();
    req.isAuthenticated = undefined;
    accessToken.addIsAuthenticated(req);
    assert.isUndefined(req.isAuthenticated);
    assert.isUndefined(req.user);
  });

  it('happy path', async () => { // eslint-disable-line
    const req = Req.generate();
    req.isAuthenticated = undefined;
    const decoded = { user: 1 };
    await accessToken.addIsAuthenticated(req, decoded);
    assert.isTrue(req.isAuthenticated());
    assert.equal(req.user.id, 1);
    assert.equal(req.user.access.length, 1);
    assert.equal(req.user.access[0].user_id, 1);
    assert.equal(req.user.access[0].role, 'admin');
  });
});
