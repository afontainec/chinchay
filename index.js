const path = require('path');
const fs = require('fs');
const Table = require('./models/table');

const chainConfig = getConfig();

const knex = require(chainConfig.knex);


function getConfig() {
  const p = path.join(process.cwd(), '.chainfile.js');
  if (fs.existsSync(p)) {
    return require(p); // eslint-disable-line
  }
  return require('.chainfile'); // eslint-disable-line
}

Table.setKnex(knex);

module.exports = {
  Table,
};
