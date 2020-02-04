const path = require('path');

module.exports = {
  access: {
    admin: ['*'],
  },
  knex: path.join(__dirname, '..', '..', 'knex.js'),
};
