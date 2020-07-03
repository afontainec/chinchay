
exports.up = function createTable(knex) {
  return knex.schema.createTable('users', (table) => {
    // Incremental id
    table.increments();
    table.text('username');
    table.text('password');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function dropTable(knex) {
  return knex.schema.dropTable('users');
};
