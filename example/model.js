const Table = require('$TABLEPATH$'); // eslint-disabled-this-line no-unused-vars


class $MODELNAME$ extends Table {
  constructor() {
    const table_name = '$TABLE_NAME$';
    super(table_name);
  }
}


const instance = new $MODELNAME$();


module.exports = instance;