'use strict';
const places = require('./places/samples');

exports.seed = function (knex, Promise) {
  const placePromises = [];
  places.forEach((place) => {
    placePromises.push(createPlace(knex, place));
  });
  return Promise.all(placePromises);
};

function createPlace(knex, place) {
  return knex.table('places')
    .returning('*')
    .insert(place);
}
