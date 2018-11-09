const path = require('path');

module.exports = {
  models: {
    directory: path.join(process.cwd(), '/chinchapp/models')
  },
  controllers: {
    directory: path.join(process.cwd(), '/chinchapp/controllers')
  },
  views: {
    directory: path.join(process.cwd(), '/chinchapp/views')
  },
  routes: {
    directory: path.join(process.cwd(), '/chinchapp/routes')
  },
  knex:  path.join(process.cwd(), 'knex.js')
};
