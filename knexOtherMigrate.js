process.env.NODE_ENV = 'test';
const knex = require('./otherKnex');

const run = async () => {
  await knex.migrate.latest();
  process.exit();
};

run().then(() => {
  process.exit();
}).catch((err) => {
  console.log(err);
  process.exit();
});
