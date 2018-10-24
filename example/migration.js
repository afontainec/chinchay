
exports.up = function (knex) {
  return knex.schema.createTable('$TABLE_NAME$', (table) => {
    // Incremental id
    table.increments();

    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('$TABLE_NAME$');
};
