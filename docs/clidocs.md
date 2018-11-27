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

Chinchay will build a full api so you can start working with your CRUD operation. Here is a list of the URL created and examples of how to work with them:


#### POST /api/relation_name/new

##### **Description:**
 Receives a JSON object and, in the database, inserts an entry with values defined in the JSON. It will return whether it was successful or not, and the saved entry.
##### **Example:**
  For this examples, we will assume that the relation has a column _name_ of type string and a column _price_ of type integer.

The following:              
```javascript
Requestify.post('http://localhost:3000/api/relation_name/new', {name: "this is the name", price: 100});
```

Will save in the database an entry in the relation relation_name the values with name="this is the name" and price=100. The Return is as follows:
```JSON
{
  "message": "Elemento guardado exitosamente",
  "data": {
    "id": 1,
    "name": "this is the name",
    "price": 100,
    "created_at": "2018-11-21T11:54:42.840Z",
    "updated_at": "2018-11-21T11:54:42.840Z",
    "links": [
      { "rel": "self", "href": "/api/coffee/1", "type": "GET" },
      { "rel": "edit", "href": "/api/coffee/1/edit", "type": "POST" },
      { "rel": "delete", "href": "/api/coffee/1/delete", "type": "DELETE" },
      { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
      { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
      { "rel": "count", "href": "/api/coffee/count", "type": "GET" }
    ],
  }
}
```

The following:              
```javascript
Requestify.post('http://localhost:3000/api/relation_name', {name: "this is the name"});
```

Will save in the database an entry in the relation relation_name the values with name="this is the name" and price=null. The response is:

```JSON
{
  "message": "Elemento guardado exitosamente",
  "data": {
    "id": 2,
    "name": "this is the name",
    "price": null,
    "created_at": "2018-11-21T11:57:02.767Z",
    "updated_at": "2018-11-21T11:57:02.767Z",
    "links": [
      { "rel": "self", "href": "/api/coffee/2", "type": "GET" },
      { "rel": "edit", "href": "/api/coffee/2/edit", "type": "POST" },
      { "rel": "delete", "href": "/api/coffee/2/delete", "type": "DELETE" },
      { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
      { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
      { "rel": "count", "href": "/api/coffee/count", "type": "GET" }
      ],
  }
}
```


#### GET /api/relation_name/:id

##### **Description:**
Returns a JSON object representing the object with id = :id. If it does not exists reports the error.
##### **Example:**

The following:              
```javascript
Requestify.get('http://localhost:3000/api/relation_name/1');
```

Will return a JSON representing the object with id=1 within the data key:

```JSON
{
  "message": "Busqueda encontrada exitosamente",
  "data": {
    "id": 1,
    "name": "this is the name",
    "price": 100,
    "created_at": "2018-11-21T11:54:42.840Z",
    "updated_at": "2018-11-21T11:54:42.840Z",
    "links": [
      { "rel": "self", "href": "/api/coffee/1", "type": "GET" },
      { "rel": "edit", "href": "/api/coffee/1/edit", "type": "POST" },
      { "rel": "delete", "href": "/api/coffee/1/delete", "type": "DELETE" },
      { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
      { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
      { "rel": "count", "href": "/api/coffee/count", "type": "GET" }
      ],
  }
}
```


#### GET /api/relation_name/find

##### **Description:**
Returns an array with all the entries matching the given query. If the query its empty it will return all the entries.
##### **Simple Queries:**
Here are some examples of how to work with simple queries: The query will filter with the given format _key=value_.

1. Get all:     
    If no query is defined, it will return all the elements.
      ````javascript
      Requestify.get('http://localhost:3000/api/relation_name/find');
      ````

    Will return an array with all the entries:

    ```JSON
{
  "message": "Busqueda encontrada exitosamente",
  "data": [{
          "id": 1,
          "name": "this is the name",
          "price": 100,
          "created_at": "2018-11-21T11:54:42.840Z",
          "updated_at": "2018-11-21T11:54:42.840Z",
          "links": [ { "rel": "self", "href": "/api/coffee/1", "type": "GET" },
            { "rel": "edit", "href": "/api/coffee/1/edit", "type": "POST" },
            { "rel": "delete", "href": "/api/coffee/1/delete", "type": "DELETE" },
            { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
            { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
            { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
          }, {
            "id": 2,
            "name": "this is the name",
            "price": null,
            "created_at": "2018-11-21T11:57:02.767Z",
            "updated_at": "2018-11-21T11:57:02.767Z",
            "links": [ { "rel": "self", "href": "/api/coffee/2", "type": "GET" },
              { "rel": "edit", "href": "/api/coffee/2/edit", "type": "POST" },
              { "rel": "delete", "href": "/api/coffee/2/delete", "type": "DELETE" },
              { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
              { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
              { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
          }, {
            "id": 3,
            "name": "other",
            "price": 100,
            "created_at": "2018-11-21T12:06:04.065Z",
            "updated_at": "2018-11-21T12:06:04.065Z",
            "links": [ { "rel": "self", "href": "/api/coffee/3", "type": "GET" },
              { "rel": "edit", "href": "/api/coffee/3/edit", "type": "POST" },
              { "rel": "delete", "href": "/api/coffee/3/delete", "type": "DELETE" },
              { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
              { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
              { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
          }, {
            "id": 4,
            "name": "expensive",
            "price": 110,
            "created_at": "2018-11-21T12:06:22.400Z",
            "updated_at": "2018-11-21T12:06:22.400Z",
            "links": [ { "rel": "self", "href": "/api/coffee/4", "type": "GET" },
              { "rel": "edit", "href": "/api/coffee/4/edit", "type": "POST" },
              { "rel": "delete", "href": "/api/coffee/4/delete", "type": "DELETE" },
              { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
              { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
              { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
          }],
}
    ```

2. Filter with query:   
    This is the simplest by powerful way of querying, the query will filter with the given format _key=value_.

    Therefore, the request:

  ```javascript
  Requestify.get('http://localhost:3000/api/relation_name/find?price=100');
  ```
      Will return an array of all the entries were price=100:

  ```JSON
  {
  "message": "Busqueda encontrada exitosamente",
  "data": [{
      "id": 1,
      "name": "this is the name",
      "price": 100,
      "created_at": "2018-11-21T11:54:42.840Z",
      "updated_at": "2018-11-21T11:54:42.840Z",
      "links": [
        { "rel": "self", "href": "/api/coffee/1", "type": "GET" },
        { "rel": "edit", "href": "/api/coffee/1/edit", "type": "POST" },
        { "rel": "delete", "href": "/api/coffee/1/delete", "type": "DELETE" },
        { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
        { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
        { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
      }, {
      "id": 3,
      "name": "other",
      "price": 100,
      "created_at": "2018-11-21T12:06:04.065Z",
      "updated_at": "2018-11-21T12:06:04.065Z",
      "links": [
        { "rel": "self", "href": "/api/coffee/3", "type": "GET" },
        { "rel": "edit", "href": "/api/coffee/3/edit", "type": "POST" },
        { "rel": "delete", "href": "/api/coffee/3/delete", "type": "DELETE" },
        { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
        { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
        { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
      }],
    }
  ```

    and the following:              
```javascript
Requestify.get('http://localhost:3000/api/relation_name/find?price=100&name=other');
```

    Will return an array of all the entries were price=100 and name="other":
```JSON
{
"message": "Busqueda encontrada exitosamente",
"data": [ {
      "id": 3,
      "name": "other",
      "price": 100,
      "created_at": "2018-11-21T12:06:04.065Z",
      "updated_at": "2018-11-21T12:06:04.065Z",
      "links": [
            { "rel": "self", "href": "/api/coffee/3", "type": "GET" },
            { "rel": "edit", "href": "/api/coffee/3/edit", "type": "POST" },
            { "rel": "delete", "href": "/api/coffee/3/delete", "type": "DELETE" },
            { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
            { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
            { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
      }],
}
```



##### **Complex Queries:**  
Here are some examples of how to work with more complex queries. In the query you should pass an array with two values, as such: key=["command",value]. The query will translate to SQL as follows `WHERE  key command value`. For example:


  price=["<>", 90] will translate to `WHERE  price <> 90`

  price=["in", [90, 100]] will translate to `WHERE  price in {90, 100}`

  price=["not in", [90, 100]] will translate to `WHERE  price not in {90, 100}`

  It is very important for the brackets to be before and after every array, otherwise it will be parse as a string, for instance:

  price=">",90 will translate to `WHERE  price = '">", 90'`


The following:              
  ```javascript
  Requestify.get('http://localhost:3000/api/relation_name/find?price=[">", 105]');
  ```

  Will return an array of all the entries where price > 105 :
```JSON
{
"message": "Busqueda encontrada exitosamente",
"data": [ {
    "id": 4,
    "name": "expensive",
    "price": 110,
    "created_at": "2018-11-21T12:06:22.400Z",
    "updated_at": "2018-11-21T12:06:22.400Z",
    "links": [
          { "rel": "self", "href": "/api/coffee/4", "type": "GET" },
          { "rel": "edit", "href": "/api/coffee/4/edit", "type": "POST" },
          { "rel": "delete", "href": "/api/coffee/4/delete", "type": "DELETE" },
          { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
          { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
          { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
    }],
}
```

The following:              
  ```javascript
  Requestify.get('http://localhost:3000/api/relation_name/find?price=["in",[110,100]]');
  ```

  Will return an array of all the entries where price = 110 or price = 100 :
```JSON
{
"message": "Busqueda encontrada exitosamente",
"data": [ {
    "id": 1,
    "name": "this is the name",
    "price": 100,
    "created_at": "2018-11-21T11:54:42.840Z",
    "updated_at": "2018-11-21T11:54:42.840Z",
    "links": [
      { "rel": "self", "href": "/api/coffee/1", "type": "GET" },
      { "rel": "edit", "href": "/api/coffee/1/edit", "type": "POST" },
      { "rel": "delete", "href": "/api/coffee/1/delete", "type": "DELETE" },
      { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
      { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
      { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
    }, {
    "id": 3,
    "name": "other",
    "price": 100,
    "created_at": "2018-11-21T12:06:04.065Z",
    "updated_at": "2018-11-21T12:06:04.065Z",
    "links": [
      { "rel": "self", "href": "/api/coffee/3", "type": "GET" },
      { "rel": "edit", "href": "/api/coffee/3/edit", "type": "POST" },
      { "rel": "delete", "href": "/api/coffee/3/delete", "type": "DELETE" },
      { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
      { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
      { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
    }, {
    "id": 4,
    "name": "expensive",
    "price": 110,
    "created_at": "2018-11-21T12:06:22.400Z",
    "updated_at": "2018-11-21T12:06:22.400Z",
    "links": [
      { "rel": "self", "href": "/api/coffee/4", "type": "GET" },
      { "rel": "edit", "href": "/api/coffee/4/edit", "type": "POST" },
      { "rel": "delete", "href": "/api/coffee/4/delete", "type": "DELETE" },
      { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
      { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
      { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
    }],
}
```

##### **Raw Query:**  

With simple queries and complex queries you can work around most cases, however, sometimes its just not enough. Chinchay allows have a fully configurable querying option. You may add a _rawWhere_ to your query. Whatever you pass in the raw where will go explicitly as it is in the where,  *be careful, it can lead to SQL injection*. To work with SQL injections you can also pass an array, where the first argument are is the command and the second the values to insert.

For instance, the following:


Will return all the entries where name = 'other' or name = 'expensive'.


However, if you want to specify in an array-format you could run the following command:

And this will have the same return:



##### **Columns:**  

##### **Advance Options:**  

startDate, endDate
group by, orderby
limit, offset
rawSelect, clearSelect






#### PUT PATCH POST /relation_name/:id/edit

##### **Description:**
This URL can be called either with PUT, PATCH or POST. It receives a JSON object and, in the database, updates the values defined in the JSON for the entry with id = :id. It will response if it was successful the update and the entry updated.

##### **Example:**

The following:              
      ````javascript
      Requestify.post('http://localhost:3000/api/relation_name/1/edit', {name: 'this is another name', price: 110});
      ````

Will change in the database the entry with id = 1 in the relation relation_name the values with name and price to "this is another name" and 110.


The following:              
      ````javascript
      Requestify.post('http://localhost:3000/api/relation_name/1/edit', {price: 90});
      ````

Will change in the database the entry with id = 1 in the relation relation_name the value price to 90 and leave the name intact.


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
