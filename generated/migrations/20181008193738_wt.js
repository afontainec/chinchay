
exports.up = function (knex) {
  return knex.schema.createTable('wt', (table) => {
    // Incremental id
    table.increments();

    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('wt');
};
