/* global describe, it */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const { assert } = require('chai');
const { alert } = require('codemaster');
const { ErrorHandler } = require('../../../');


// Our parent block
// eslint-disable-next-line max-lines-per-function
describe('Error Handler intialize', () => {

  it('happy path: nothing is passed', async () => {
    const handler = new ErrorHandler();
    assert.deepEqual(handler.ERROR_TRANSLATE, handler.DEFAULT_ERROR_TRANSLATE);
  });

  it('happy path: custom translate is passed', async () => {
    const handler = new ErrorHandler({ A: 1 });
    const expected = handler.DEFAULT_ERROR_TRANSLATE;
    expected.A = 1;
    assert.deepEqual(handler.ERROR_TRANSLATE, expected);
  });

  it('replace = true', async () => {
    const handler = new ErrorHandler({ A: 1 }, true);
    const expected = { A: 1 };
    assert.deepEqual(handler.ERROR_TRANSLATE, expected);
  });


  it('multiple error handlers, redefine default', async () => {
    const errorTranslate = {
      unexistantID: {
        code: 500,
        message: 'Id solicitado no existe',
      },
    };
    const first = new ErrorHandler(errorTranslate);
    const second = new ErrorHandler();
    assert.equal(first.getHTTPCode({ chinchayCode: 'unexistantID' }), 500);
    assert.equal(second.getHTTPCode({ chinchayCode: 'unexistantID' }), 400);
  });

  it('no logger given', async () => {
    const handler = new ErrorHandler();
    assert.deepEqual(handler.logger, alert.print);
  });

  it('logger given', async () => {
    const logger = () => {};
    const handler = new ErrorHandler(null, null, logger);
    assert.deepEqual(handler.logger, logger);
  });
});
