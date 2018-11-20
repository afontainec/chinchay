const environment = process.env.NODE_ENV || 'development';
const config = require('./knexfile_other')[environment];

module.exports = require('knex')(config);
