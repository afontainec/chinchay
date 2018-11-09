## CLI Tutorial

### Requirements
  * [npm](https://www.npmjs.com/get-npm)
  * [express](https://expressjs.com/)
  * [Postgres](https://www.postgresql.org/)

  If you do not have express installed you can easily install it with npm
```
$ npm install express -g
```

## Create nodejs app with express

Create a nodejs app called: test_chinchay
```
$ express test_chinchay && cd test_chinchay
```

We will install drivers to use PostgresSQL database. we will use knexjs and pg

```
$ npm install pg -s
$ npm install knex -s
```

Also we will use ejs instead off jade. So we need to run
```
$ npm install ejs -s
```

You can run the following commands to see the default express app
```
$ npm install
$ npm start
```

Visit http://localhost:3000 to see the defaut express web app

## Create Postgresql Database

In this tutorial we will not dig in how Postgres fully work. For more information on how to work around Postgres visit https://www.postgresql.org/.

In order to connect to Postgres, we need to create a database. If you have postgresql installed you can run
```
$ psql
```
This should open up postgresql console. Run the following command:

```
postgres=# CREATE DATABASE test_chinchay;
```
*NOTE:* Depending on your default user and psql version the syntax of the previous line may vary.

if its successful close psql, run:
```
postgres=# \q

```


## Connecting to the Database

In this tutorial we will not dig in how knex fully work. For more information on how to work around knex visit https://knex.org/.

First of all, we highly recommend to install knex globally:

```
$ npm install knex -g
```

Until now we should have the following Directory Structure:

    .
    ├── bin                  
    ├── node_modules       
    ├── public   
    ├── routes
    ├── views              
    ├── app.js
    ├── package-lock.json
    └── package.json

We will add the following:

    .
    ├── bin
    ├── database
        ├── migrations       
        └── seeds
            ├── development
            ├── production   
            └──  test
    ├── node_modules       
    ├── public   
    ├── routes
    ├── views              
    ├── app.js
    ├── knexfile.js        
    ├── knex.js        
    ├── package-lock.json
    └── package.json

* database/migrations/ directory will hold all the migrations (changes) to the database.
* database/seed/ directory will hold all the seed files. Every subdirectory will hold the seed corresponding to that environment.
* knex.js Will be the instance to connect to the database.

Go ahead and create those files

Before we continue we need to create a configuration file to let knex know how to interact with the database. We need to create a knexfile.js
```
$ touch knexfile.js
```
Add the following code to knexfile.js

```javascript
const path = require('path');

module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://localhost:5432/test_chinchay',
    migrations: {
      directory: path.join(__dirname, '/database/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/database/seeds/test'),
    },
    acquireConnectionTimeout: 10000,
  },
  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/test_chinchay',
    migrations: {
      directory: path.join(__dirname, '/database/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/database/seeds/development'),
    },
    acquireConnectionTimeout: 10000,
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost:5432/test_chinchay',
    migrations: {
      directory: path.join(__dirname, '/database/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/database/seeds/production'),
    },
    acquireConnectionTimeout: 10000,
  },
  staging: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost:5432/test_chinchay',
    migrations: {
      directory: path.join(__dirname, '/database/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/database/seeds/production'),
    },
    acquireConnectionTimeout: 10000,
  },
};

```
_NOTE:_ If your Postgres user it is not postgres change it accordingly in the connection URL.

We will not get i detail of how this file works, but basically we are telling knex were we want to save the migrations, the seeds and what is the url to connect to the database. Note that the knexfile defines this variables for every environment by separate.


Now we need to add the following code to the knex.js file:

```javascript
const environment = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[environment];
module.exports = require('knex')(config);
```


Now knex is configured to connect to the database.


## Using Chinchay

Now its the simple part. But before we need to create one last file:
* .chainfile.js: file for all the configuration for chinchay.

Go ahead and create this file.


In the .chainfile.js add the following:
```javascript
const path = require('path');

module.exports = {
  models: {
    directory: path.join(__dirname, '/models'),
  },
  controllers: {
    directory: path.join(__dirname, '/controllers')
  },
  views: {
    directory: path.join(__dirname, '/views')
  },
  routes: {
    directory: path.join(__dirname, '/routes')
  },
  knex:  path.join(__dirname, 'knex.js')
};
```

Here we are defining which directories will hold the  the models, the controllers, the views and the routes.

Install chinchay:
```
$ npm install chinchay -s
$ npm install chinchay -g
```
This will allow you to run chinchay CLI.

Lets build a new relation called coffee and the files to work around with it:

```
$ chinchay new coffee
```

This will create a model, a controllers, views, routes and a knex migration in the directories defined in .chainfile.js.


The migrations will be saved in the directory database/migrations/. The name will vary but it will be appended by an coffee.js

In this file insert the following:
```javascript
exports.up = function (knex) {
  return knex.schema.createTable('coffee', (table) => {
    // Incremental id
    table.increments();
    table.string('name').notNullable();
    table.integer('price');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('coffee');
};
```

This is the piece of code that will create a relation witin our database with the variables name and price. Also will generate a id and a created_at and updated_at timestamps for every entry. To run this migration:
```
$ knex migrate:latest
```


Last, but not least, add the following lines to the app.js

```javascript
var coffee = require('./routes/coffee');
var coffeeAPI = require('./routes/coffeeAPI');
app.use('/', coffee);
app.use('/', coffeeAPI);
```
Now run the app
```
$ npm start
```

and visit localhost:3000/coffee

Click new to create a coffee!

Enjoy!

For more information to work around Chinchay CLI:

[See the Command Line Interface Documentation!](https://afontainec.github.io/chinchay/clidocs)
