
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
};


class ErrorHandler {


  constructor(postgresToHttpError, replace) {
    postgresToHttpError = postgresToHttpError || {};
    if (replace) this.ERROR_TRANSLATE = postgresToHttpError;
    this.ERROR_TRANSLATE = Object.assign(POSTGRESS_TO_HTTP_ERROR, postgresToHttpError);
  }

  getHTTPCode(error) {
    if (error.suggestedHTTPCode) return error.suggestedHTTPCode;
    const translation = this.ERROR_TRANSLATE[error.postgresCode];
    if (!translation) return 500;
    return translation.code;
  }

  getHTTPMessage(error) {
    const translation = this.ERROR_TRANSLATE[error.postgresCode];
    if (!translation) return 'Internal Error';
    return translation.message;
  }

}


module.exports = ErrorHandler;
