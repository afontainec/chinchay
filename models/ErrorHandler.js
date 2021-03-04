const { utils, alert } = require('codemaster');
const httpResponse = require('./httpResponse');

const POSTGRES_TO_HTTP_ERROR = {
  42703: {
    code: 400,
    message: 'Columna solicitada no existe.',
  },
  42803: {
    code: 400,
    message: 'Group by faltante o mal definido.',
  },
  '2201W': {
    code: 400,
    message: 'Limite definido es inválido.',
  },
  42601: {
    code: 400,
    message: 'No se pudo armar la query correctamente. Revisar bien si se está usando raw.',
  },
  22007: {
    code: 400,
    message: 'Fecha ingresada no es válida',
  },
  '22P02': {
    code: 400,
    message: 'Variable mal definida. Data type no corresponde. ',
  },
  unexistantID: {
    code: 400,
    message: 'Intentando de agregar columna inexistente.',
  },
  idsDiffer: {
    code: 400,
    message: 'Ids no coinciden.',
  },
  empty_update: {
    code: 400,
    message: 'Error: Nothing to update or unexistant column',
  },
  forbidden: {
    code: 403,
    message: 'Access restricted to this data',
  },
  no_entry_for_id: {
    code: 404,
    message: 'No se encontró una entrada para el id solicitado',
  },
};


class ErrorHandler {


  constructor(errorTranslate, replace, logger) {
    errorTranslate = errorTranslate || {};
    if (replace) this.ERROR_TRANSLATE = errorTranslate;
    else this.ERROR_TRANSLATE = Object.assign(utils.cloneJSON(POSTGRES_TO_HTTP_ERROR), errorTranslate);
    this.DEFAULT_ERROR_TRANSLATE = POSTGRES_TO_HTTP_ERROR;
    this.logger = logger || alert.print;
  }

  getHTTPCode(error) {
    error = error || {};
    const translation = this.ERROR_TRANSLATE[error.chinchayCode];
    if (!translation) return error.suggestedHTTPCode || 500;
    return translation.code;
  }

  getHTTPMessage(error) {
    error = error || {};
    const translation = this.ERROR_TRANSLATE[error.chinchayCode] || {};
    return translation.message || error.chinchayMessage || 'Internal Error';
  }

  getHTTPCodeAndMessage(error) {
    return { code: this.getHTTPCode(error), message: this.getHTTPMessage(error) };
  }

  sendError(error, res, logConfiguration) {
    const { code, message } = this.getHTTPCodeAndMessage(error);
    this.logError(logConfiguration, code, error);
    const json = httpResponse.error(message, error, code);
    return res.status(code).send(json);
  }

  logError(configuration, code, error) {
    if (!this.logger || !configuration || !configuration[code]) return;
    if (configuration[code]) {
      const text = configuration[code].text || configuration[code];
      this.logger(text, code, error);
    }
  }
}


module.exports = ErrorHandler;
