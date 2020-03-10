
class ForbiddenError extends Error {

  constructor(message) {
    super(message);
    this.chinchayCode = 'forbidden';
  }
}

module.exports = ForbiddenError;
