const knex = require('./otherKnex');

const run = async () => {
  await knex.migrate.latest();
  process.exit();
};

run();
