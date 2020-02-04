const path = require('path');
const fs = require('fs');
const Table = require('./models/table');
const Hateoas = require('./models/hateoas');
const Access = require('./models/access');


const chainConfig = getConfig();

const knex = require(chainConfig.knex); // eslint-disable-line import/no-dynamic-require
const access = require(chainConfig.access); // eslint-disable-line import/no-dynamic-require


function getConfig() {
  const p = path.join(process.cwd(), '.chainfile.js');
  if (fs.existsSync(p)) {
    return require(p); // eslint-disable-line
  }
  return require('.chainfile'); // eslint-disable-line
}

Table.setDefaultKnex(knex);
Access.setTheWall(access);

module.exports = {
  Table,
  Hateoas,
  Access,
};
