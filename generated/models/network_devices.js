const Table = require('../../services/models/tableGateway/table'); // eslint-disabled-this-line no-unused-vars


class NetworkDevices extends Table {
  constructor() {
    const table_name = 'network_devices';
    super(table_name);
  }
}


const instance = new NetworkDevices();


module.exports = instance;
