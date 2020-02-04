const path = require('path');

module.exports = {
  access: {
    admin: ['*'],
    basic: [
      '/dashboard',
      '/profile',
      '/contact',
      ['/users/:id/password', 'id', 'get'],
      ['/users/:id/access', 'id', 'get'],
      ['/api/v1/users/:id/authCheck', 'id', 'post'],
      ['/api/v1/users/:id/update/auth', 'id', 'put'],
      ['/contact/send/mail', undefined, 'post'],
    ],
    placesAdmin: [
      ['/places', undefined, 'get'],
      ['/places/*'],
      'api/v1/places/*',
    ],
    venueOwner: [
      ['/places', undefined, 'get'],
      ['/places/count', undefined, 'get'],
      ['/places/disabled', undefined, 'get'],
      ['/places/:id', 'id', 'get'],
      ['/sponsorship/new/for/place/:place_id', 'place_id', 'post'],
      ['/api/gather/new/for/place/:id', 'id', 'post'],
      ['/api/v1/places/:id', 'id', 'get'],
      ['/api/gather/new', undefined, 'post'],
    ],
    allPlacesReader: [
      ['/places', undefined, 'get'],
      ['/places/disabled', undefined, 'get'],
      ['/places/:id', undefined, 'get'],
    ],
    userAdmin: [
      '/users',
      ['/users/*'],
    ],
  },
  knex: path.join(__dirname, '..', 'db', 'knex.js'),
};
