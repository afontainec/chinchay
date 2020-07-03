const path = require('path');

module.exports = {
  models: {
    directory: path.join(process.cwd(), '/chinchapp/backend/models')
  },
  controllers: {
    directory: path.join(process.cwd(), '/chinchapp/backend/controllers')
  },
  views: {
    directory: path.join(process.cwd(), '/chinchapp/backend/views'),
    angular: path.join(process.cwd(), '/chinchapp/'),
  },
  routes: {
    directory: path.join(process.cwd(), '/chinchapp/backend/routes')
  },
  access: path.join(process.cwd(), 'access.js'),
  knex:  path.join(process.cwd(), 'knex.js'),
  thewall: path.join(process.cwd(), 'thewall.js'),
  middleware: 'api'
};
