const path = require('path');

module.exports = {
  models: {
    directory: path.join(process.cwd(), 'models')
  },
  controllers: {
    directory: path.join(process.cwd(), 'controllers')
  },
  views: {
    directory: path.join(process.cwd(), 'views'),
    angular: path.join(process.cwd()),
  },
  routes: {
    directory: path.join(process.cwd(), 'routes')
  },
};
