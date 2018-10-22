const User = require('../../../../models/users');

module.exports = [{
  username: 'accionet',
  password: User.generateHash(process.env.ACCIONET_ADMIN_PASSWORD),
  email: 'antonio@accionet.cl',
  is_admin: true,
  is_active: true,
}, {
  username: 'nonadmin',
  password: User.generateHash(process.env.ACCIONET_ADMIN_PASSWORD),
  email: 'antonio@accionet.cl',
  is_admin: false,
  is_active: true,
}];
