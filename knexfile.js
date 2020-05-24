const path = require('path');

module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://localhost:5432/chinchay_test',
    migrations: {
      directory: path.join(__dirname, 'db', 'migrations', 'test'),
    },
    seeds: {
      directory: path.join(__dirname, 'db', 'seeds', 'test'),
    },
    acquireConnectionTimeout: 10000,
  },
  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/chinchay',
    migrations: {
      directory: path.join(__dirname, 'chinchapp', 'backend', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/db/seeds/development'),
    },
    acquireConnectionTimeout: 10000,
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost:5432/chinchay',
    migrations: {
      directory: path.join(__dirname, 'chinchapp', 'backend', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/db/seeds/production'),
    },
    acquireConnectionTimeout: 10000,
  },
  staging: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost:5432/chinchay2',
    migrations: {
      directory: path.join(__dirname, 'chinchapp', 'backend', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/db/seeds/production'),
    },
    acquireConnectionTimeout: 10000,
  },
};
