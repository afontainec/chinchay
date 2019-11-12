const coffees = require('./coffee/samples');

exports.seed = function seed(knex) {
  const promises = [];
  coffees.forEach((coffee) => {
    promises.push(createPlace(knex, coffee));
  });
  return Promise.all(promises);
};

function createPlace(knex, coffee) {
  return knex.table('coffee')
    .returning('*')
    .insert(coffee);
}
