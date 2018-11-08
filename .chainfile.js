const path = require('path');

module.exports = {
  models: {
    directory: path.join(process.cwd(), '/chinchap/models')
  },
  controllers: {
    directory: path.join(process.cwd(), '/chinchap/controllers')
  },
  views: {
    directory: path.join(process.cwd(), '/chinchap/views')
  },
  routes: {
    directory: path.join(process.cwd(), '/chinchap/routes')
  },
  knex:  path.join(process.cwd(), 'knex.js')
};
