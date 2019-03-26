const Table = require('../index').Table; // eslint-disabled-this-line no-unused-vars


class Places extends Table {
  constructor() {
    const table_name = 'coffee';
    super(table_name);
  }
}


const instance = new Places();


module.exports = instance;
