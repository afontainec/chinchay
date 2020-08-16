/* global describe, it */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');

const { Table } = require('../../../..');


// eslint-disable-next-line max-lines-per-function
describe('TABLE GATEWAY: getSecurityMode', () => {

  it('configuration = true (deprecated version) ', (done) => {
    const securityMode = Table.getSecurityMode(true);
    assert.isTrue(securityMode);
    done();
  });

  it('configuration is undefined', (done) => {
    const securityMode = Table.getSecurityMode();
    assert.isTrue(securityMode);
    done();
  });

  it('configuration.securityMode = true', (done) => {
    const securityMode = Table.getSecurityMode({ securityMode: true });
    assert.isTrue(securityMode);
    done();
  });

  it('configuration.securityMode = undefined', (done) => {
    const securityMode = Table.getSecurityMode({ });
    assert.isTrue(securityMode);
    done();
  });

  it('configuration.securityMode = false', (done) => {
    const securityMode = Table.getSecurityMode({ securityMode: false });
    assert.isFalse(securityMode);
    done();
  });

});
