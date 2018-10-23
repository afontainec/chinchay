const Table = require('../../services/models/tableGateway/table'); // eslint-disabled-this-line no-unused-vars


class Waba extends Table {
  constructor() {
    const table_name = 'waba';
    super(table_name);
  }
}


const instance = new Waba();


module.exports = instance;
