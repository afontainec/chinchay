const path = require('path');

module.exports = {
  models: {
    directory: path.join(__dirname, '/generated/models'),
    superclass: path.join(__dirname, '/services/models/tableGateway/table'),
  }
};
