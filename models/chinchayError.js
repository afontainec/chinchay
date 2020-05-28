
class ChinchayError extends Error {

  constructor(error, chinchayCode) {
    super(error);
    this.chinchayCode = chinchayCode;
  }
}

module.exports = ChinchayError;
