
exports.up = function createCoffee(knex) {
  return knex.schema.createTable('coffee', (table) => {
    // Incremental id
    table.increments();
    table.string('name');
    table.integer('price');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function dropCoffee(knex) {
  return knex.schema.dropTable('coffee');
};
