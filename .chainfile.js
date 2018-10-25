const path = require('path');

module.exports = {
  models: {
    directory: path.join(__dirname, '/generated/models'),
    superclass: path.join(__dirname, '/services/models/tableGateway/table'),
  },
  controllers: {
    directory: path.join(__dirname, '/generated/controllers')
  },
  views: {
    directory: path.join(__dirname, '/generated/views')
  },
  routes: {
    directory: path.join(__dirname, '/generated/routes')
  },
  knex:  path.join(__dirname, 'knex.js')
};
