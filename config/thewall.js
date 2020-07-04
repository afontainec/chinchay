const path = require('path');

module.exports = {
  access: {
    admin: ['*'],
    restricted: [['/test/:id', 'id', 'get']],
  },
  knex: path.join(__dirname, '..', 'knex.js'),
};
