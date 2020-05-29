
const POSTGRESS_TO_HTTP_ERROR = {
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
};


class ErrorHandler {


  constructor(errorTranslate, replace) {
    errorTranslate = errorTranslate || {};
    if (replace) this.ERROR_TRANSLATE = errorTranslate;
    else this.ERROR_TRANSLATE = Object.assign(POSTGRESS_TO_HTTP_ERROR, errorTranslate);
    this.DEFAULT_ERROR_TRANSLATE = POSTGRESS_TO_HTTP_ERROR;
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

}


module.exports = ErrorHandler;
