const Table = require('../../services/models/tableGateway/table'); // eslint-disabled-this-line no-unused-vars


class Were extends Table {
  constructor() {
    const table_name = 'were';
    super(table_name);
  }
}


const instance = new Were();


module.exports = instance;
