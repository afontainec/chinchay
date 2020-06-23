const TheWall = require('../../../thewall');
const users = require('./users/samples');

exports.seed = async (knex) => {
  const [admin] = await createUser(knex, users[0]);
  await TheWall.addAccess(admin.id, 'admin');
  const response = await createUser(knex, users[1]);
  const user = response[0];
  await createAccess(knex, user.id);
};

function createUser(knex, user) {
  return knex.table('users')
    .returning('*')
    .insert(user);
}

function createAccess(knex, userId) {
  const q1 = TheWall.addAccess(userId, 'restricted', 1);
  return Promise.all([q1]);
}
