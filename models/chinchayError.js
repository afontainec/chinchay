
class ChinchayError extends Error {

  constructor(error, chinchayCode, message) {
    if (typeof error === 'string') error = new Error((error));
    super(error);
    this.chinchayMessage = message || error.message;
    this.chinchayCode = chinchayCode;
  }

}

module.exports = ChinchayError;
