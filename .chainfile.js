const path = require('path');

module.exports = {
  models: {
    directory: path.join(__dirname, '/generated/models')
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
