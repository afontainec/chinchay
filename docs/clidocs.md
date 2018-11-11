## Command Line Interface Documentation

Creating CRUD (Create, Read, Update, Delete) operations has never being easier than with Chinchay. Use a intuitive and easy-to-use CLI to get started, generating Model View Controllers with just one command.

Do not get stuck making complex SQL queries. Chinchay makes that part easy using readable JSON object.


### Getting Started

First things first, we need a Node.js app with express,	knex and postgresql. So go ahead and create it, if you are lost or have no idea what are we talking about, no worries, follow our step-by-step [CLI Tutorial](/chinchay/clitutorial).

Once you have your app nice and ready, lets add the Chinchay Dependency, run `npm install chinchay -s` and `npm install chinchay -g`. The **-g** its really important for the CLI to work.

Now its time for magic,  run the command: 
```$ chinchay new relation_name
```

Where _relation_name_ is the name of the relation you want to set the CRUD operations.

This command will create 2 route files, 1 controller, 1 model, 4 views files and 1 migration file. We will explain how to workaround each file created. You can modify the directory where they were saved by creating a .chainfile.js, feel free to go to [chainfile section](#.chainfile.js) for more information.


We need to declare the schema of our relation, we do this in the migration file. Go ahead and do so, if you don't have a clue of what are we talking about, check our [migration section](#migration). Don't forget to run: `$ knex migrate:latest`

Lastly we add to the app.js file the routes by adding the following lines:

```javascript
var relation_name = require('./routes/relation_name');
var relation_nameAPI = require('./routes/relation_nameAPI');
app.use('/', relation_name);
app.use('/', relation_nameAPI);
```


You can run `npm start` and	 navigate to http://localhost:3000/relation_name to start working with your Chinchay app!


### Working with the generated API:

The following URLs are now accessible:

#### POST /relation_name/new

	* **Description:** Receives a JSON object and, in the database, inserts an entry with values defined in the JSON.
	* **Example:** 
      * **Expected Output:**

#### PUT PATCH POST /relation_name/:id/edit

	* **Description:** Receives a JSON object and, in the database, updates the values defined in the JSON for the entry with id = :id.
	* **Example:** 
      * **Expected Output:**

#### DELETE /relation_name/:id

	* **Description:** In the database deletes the entry with id = :id.
	* **Example:** 
      * **Expected Output:**
 
The Following URLs are created in a separated file: relationNameAPI.js.

#### GET /api/relation_name/find

#### GET /api/relation_name/count


Beside all this URLs, there are some URLs that render web pages:

#### GET /relation_name/
#### GET /relation_name/:id
#### GET /relation_name/:id/edit



### The "new" Command

This command will create migrations, models, controllers, views and routes for a given relation. Basically with just one command you are all set to for the CRUD (create, read, update, delete) of than relation. You can use it by running:

```
$ chinchay new relation_name
```

Where relation_name is the name of the relation you want to work with.

#### Migration

A migration file will be created on the directory specified in the knexfile. If you are unfamiliar of how knexfile or knex works see the [knex documentation](https://knexjs.org/).

But, in a glance, knex uses migrations to make changes to the database schema. For every change you want to make, you create a migration file.
This file has two main methods: _up_ and _down_. The change to the database must be included in the _up_ method where in the _down_ method code to reverse the change should be provided. Therefore you can go back and forth a migration running the _down_ and _up_ method.
The main commands that knex uses here are:

```
$ knex migrate:latest
```
This will run all the _up_ methods of the migration files. It will register which migrations it ran, therefore if yo create more migration and then run again this command, only the new migrations will ran.
```
$ knex migrate:rollback
```
This will run all the _down_ methods of the migration files. Its kind of an "undo" for the previous command.
```
$ knex migrate:make migration_name
```
This will create a new migration file called _migration_name_.

When you run:
```
$ chinchay new relation_name
```
A migration file is created as if you had ran:
```
$ knex migrate:make relation_name
```

By default this file is as follows:

```javascript
exports.up = function (knex) {
  return knex.schema.createTable('relation_name', (table) => {
    // Incremental id
    table.increments();

    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('relation_name');
};
```

It will create a table with an incremental id and a created_at and updated_at columns. You can edit this file as you wish, for example:

```javascript
exports.up = function (knex) {
  return knex.schema.createTable('relation_name', (table) => {
    // Incremental id
    table.increments();
    table.string('name').notNullable();
    table.integer('price');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('relation_name');
};
```

Go to the [knex documentation](https://knexjs.org/) for more info of how to work around migrations.

Dont forget to run: `$ knex migrate:latest ` in order for the migration to take place!

#### Routes

The command also generates a lot of routes to work around with this relation.
This routes are generated in two separated files: relationName.js and relationNameAPI.js. Both files are created within the directory specified in the [chainfile](#.chainfile.js). This will be explained further on but feel free to go to the [chainfile section](#.chainfile.js).

The CRUD operations are in the following routes:

##### C for CREATE

* **URL:** _POST_ /relation_name/new
* **File:** relationName.js
* **Description:** This URL creates a new entry in the relation. It recieved a JSON object as parameter with the columns name.
* **EXAMPLE:** Here is an example using requestify:
```javascript
requestify.post('/relation_name/new', {
    name: 'The name of the entry',
    price: 20
  });
```
This will create the entry with the given name and price.

##### R for READ

* **URL:** _GET_ /relation_name/:id
* **File:** relationNameAPI.js
* **Description:** This URL returns the JSON corresponding to the entry with the given id.
* **EXAMPLE:** Here is an example using requestify:
```javascript
const response = await requestify.get('/relation_name/1');
const body = response.getBody();
```


* **URL:** *_DELETE_ /relation_name/:id
* **File:** relationName.js
* **Description:** This URL deletes an entry in the relation.
* **EXAMPLE:** Here is an example using requestify:
```javascript
requestify.delete('/relation_name/1');
```
This will delete the entry with id = 1.

##### U for UPDATE

* **URL:** _PUT_ _POST_ _PATCH_ /relation_name/:id/edit
* **File:** relationName.js
* **Description:** This URL updates an entry in the relation. it recieved a JSON object as parameter with the columns name.
* **EXAMPLE:** Here is an example using requestify:
```javascript
requestify.put('/relation_name/1/edit', {
    name: 'This is the new name',
    price: 10
  });
```
This will update the name and price of the entry with id = 1. It will only update the columns specified, therefore if the price was not included in the JSON, only the name will be updated.

* **URL:** *_DELETE_ /relation_name/:id
* **File:** relationName.js
* **Description:** This URL deletes an entry in the relation.
* **EXAMPLE:** Here is an example using requestify:
```javascript
requestify.delete('/relation_name/1');
```
This will delete the entry with id = 1.



* _GET_ /relation_name/
* _GET_ /relation_name/new
* _GET_ /relation_name/:id
* _GET_ /relation_name/:id/edit

All this files render a view. You can edit this views on the [view files created](#views)

#### Views

#### Controller

#### Model


### .chainfile.js

This is the configuration file. Chinchay will provide a default file, therefore is _optional_. This file has the following structure:

```javascript
const path = require('path');

module.exports = {
  models: {
    directory: path.join(process.cwd(), '/chinchapp/models')
  },
  controllers: {
    directory: path.join(process.cwd(), '/chinchapp/controllers')
  },
  views: {
    directory: path.join(process.cwd(), '/chinchapp/views')
  },
  routes: {
    directory: path.join(process.cwd(), '/chinchapp/routes')
  },
  knex:  path.join(process.cwd(), 'knex.js')
};
```

* **models.directory:** Indicates in which directory the models will be saved.
* **controllers.directory:** Indicates in which directory the controllers will be saved.
* **routes.directory:** Indicates in which directory the routes will be saved.
* **knex:** Where knex is saved. It used to compute the path when requiring knex.
