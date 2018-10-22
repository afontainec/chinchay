'use strict';
const users = require('./users/samples');

exports.seed = async (knex) => {
  await createUser(knex, users[0]);
  const response = await createUser(knex, users[1]);
  const user = response[0];
  await createAccess(knex, user.id);
};

function createUser(knex, user) {
  return knex.table('users')
    .returning('*')
    .insert(user);
}

function createAccess(knex, user_id) {
  const access = {
    user_id,
    access_id: 1,
    table_name: 'places',
    access_type: 'r',
  };
  const q1 = knex.table('access')
    .returning('*')
    .insert(access);

  const access3 = {
    user_id,
    access_id: 1,
    table_name: 'sponsorship',
    access_type: 'r',
  };
  const q3 = knex.table('access')
    .returning('*')
    .insert(access3);
  return Promise.all([q1, q3]);
}
