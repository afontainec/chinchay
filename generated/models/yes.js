const Table = require('../../services/models/tableGateway/table'); // eslint-disabled-this-line no-unused-vars


class Yes extends Table {
  constructor() {
    const table_name = 'yes';
    super(table_name);
  }
}


const instance = new Yes();


module.exports = instance;
