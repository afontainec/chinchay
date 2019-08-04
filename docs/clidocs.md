## Command Line Interface Documentation

Creating CRUD (Create, Read, Update, Delete) operations has never being easier than with Chinchay. Use a intuitive and easy-to-use CLI to get started, generating Model View Controllers with just one command.

Do not get stuck making complex SQL queries. Chinchay makes that part easy using readable JSON object.


### Getting Started

First things first, we need a Node.js app with express,	knex and postgresql. So go ahead and create it, if you are lost or have no idea what are we talking about, no worries, follow our step-by-step [CLI Tutorial](/chinchay/clitutorial).

Once you have your app nice and ready, lets add the Chinchay Dependency, run:
```
$ npm install chinchay -s
$ npm install chinchay -g
```
<br/>
The **-g** its really important for the CLI to work.

Now its time for magic,  run the command:
```
$ chinchay new relation_name
```
<br/>

Where _relation_name_ is the name of the relation you want to set the CRUD operations. For this documentations with a relation named _coffee_. Therefore, the command would be:
```
$ chinchay new coffee
```
<br/>

This command will create 2 route files, 1 controller, 1 model, 4 views files and 1 migration file. We will explain how to workaround each file. You can modify the directory where they were saved by creating a .chainfile.js, feel free to go to [chainfile section](#.chainfile) for more information.


We need to declare the schema of our relation, we do this in the migration file. Go ahead and do so, if you don't have a clue of what are we talking about, check our [migration section](#migration). In our case, we will use the following schema, but feel free to use another one!
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
<br/>
 Don't forget to run: `$ knex migrate:latest`

Lastly we add our routes to the app.js file, in the general case add the following lines:


```javascript
var relation_name = require('./routes/relation_name');
var relation_nameAPI = require('./routes/relation_nameAPI');
app.use('/', relation_name);
app.use('/', relation_nameAPI);
```
<br/>

In our case, using the _coffee_ relation, those lines should be:

```javascript
var coffee = require('./routes/coffee');
var coffeeAPI = require('./routes/coffeeAPI');
app.use('/', coffee);
app.use('/', coffeeAPI);
```
<br/>

To view are app, run:
```
$ npm start
```
 <br/>
 And browse to [http://localhost:3000/coffee](http://localhost:3000/coffee) to start working with your Chinchay app!


### Working with the generated API: {#generated-api}

Chinchay will build a fully functional api so you can start working with your CRUD operation. Here is a list of the URL created and examples of how to work with them:

<br/>
#### POST /api/relation_name/new
<br/>
##### **Description:**
 Receives a JSON object and, in the database, inserts an entry with values defined in the JSON. It will return whether it was successful or not, and the saved entry.
##### **Example:**
  _NOTE:_ For this, and *all* the examples we are using the _coffee_ relation we created, if another one was used, change accordingly.

The following:              
```javascript
Requestify.post('http://localhost:3000/api/coffee/new', {name: "this is the name", price: 100});
```
<br/>
Will save in the database an entry were _name="this is the name"_ and _price=100_ in the relation _coffee_. The Return is as follows:

```javascript
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
<br/>

The following:              
```javascript
Requestify.post('http://localhost:3000/api/coffee', {name: "this is the name"});
```
<br/>

Will save in the database an entry,  were _name="this is the name"_ and _price=null_, in the relation _coffee_. The response is:

```javascript
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
<br/>
In both cases, the return is an JSON object with a _message_ and a _data_ property with a JSON object representing the saved entry.
<br/>

#### GET /api/relation_name/:id {#find-by-id-api}
<br/>

##### **Description:**
Returns a JSON object representing the object with id = :id. If there is no such entry, it reports the error.
##### **Example:**

The following:              
```javascript
Requestify.get('http://localhost:3000/api/coffee/1');
```
<br/>

Will return a JSON representing the object with id=1:

```javascript
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
<br/>


#### GET /api/relation_name/find {#find-api}
<br/>
##### **Description:**
Returns an array with all the entries matching the given query.
##### **Simple Queries:**
Here are some examples of how to work with simple queries: The query will filter with the given format _key=value_.

&nbsp;**1. Get all:**  

  If no query is defined, it will return all the elements.

  Therefore, the request:

  ```javascript
  Requestify.get('http://localhost:3000/api/coffee/find');
  ```
  <br/>

  Will return an array with all the entries:

  ```javascript
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
      }
    ],
  }
  ```
  <br/>


&nbsp;**2. Filter with query:**     
  This is the simplest but powerful way of querying, the query will filter with the given format _key=value_.

  Therefore, the request:

  ```javascript
  Requestify.get('http://localhost:3000/api/coffee/find?price=100');
  ```
  <br/>
  Will return an array of all the entries were _price=100_:

  ```javascript
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
  <br/>

  and the following:              

  ```javascript
  Requestify.get('http://localhost:3000/api/relation_name/find?price=100&name=other');
  ```
  <br/>

  Will return an array of all the entries were price=100 and name="other":

  ```javascript
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
  <br/>


##### **Complex Queries:**  
Here are some examples of how to work with more complex queries. In the query you should pass an array with two values, as such: key=["command",value]. The query will translate to SQL as follows `WHERE  key command value`. For example:


  price=["<>", 90] will translate to `WHERE  price <> 90`

  price=["in", [90, 100]] will translate to `WHERE  price in {90, 100}`

  price=["not in", [90, 100]] will translate to `WHERE  price not in {90, 100}`

  It is very important for the brackets to be before and after every array, otherwise it will be parse as a string, for instance:

  price=">",90 will translate to `WHERE  price = '">", 90'`

Therefore, the following:              
  ```javascript
  Requestify.get('http://localhost:3000/api/coffee/find?price=[">", 105]');
  ```
  <br/>

  Will return an array of all the entries where price > 105 :
```javascript
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

<br/>

And the following:              
  ```javascript
  Requestify.get('http://localhost:3000/api/relation_name/find?price=["in",[110,100]]');
  ```
  <br/>

  Will return an array of all the entries where price = 110 or price = 100 :
```javascript
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
<br/>

##### **Raw Query:**  

With simple queries and complex queries you can work around most cases, however, sometimes its just not enough. Chinchay have a fully configurable querying option. You may add a _rawWhere_ to your query. Whatever you pass in the raw where will go explicitly as it is in the where,  *be careful, it can lead to SQL injection*. To work with SQL injections you can also pass an array, where the first argument is the command and the second the values to insert.

For instance, the following:

```javascript
Requestify.get("http://localhost:3000/api/coffee/find?rawWhere=name = 'expensive' or name = 'other'");
```
<br/>

Will return all the entries where _name_ = 'other' or _name_ = 'expensive'.
```javascript
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
<br/>

However, if you want to specify in an array-format you could run the following command:

And this will have the same return:

```javascript
Requestify.get(`http://localhost:3000/api/coffee/find?rawWhere=["name = ? or name = ? ", ["expensive", "other"]]`);
```
<br/>

```javascript
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
<br/>



##### **Columns:**


Sometimes we don't want to get all the information, just the essential stuff. The columns options comes handy. In an array you can specify all the columns you want to get.

For instance, the following:

```javascript
Requestify.get("http://localhost:3000/api/coffee/find?columns=name");
```
<br/>

Will return all the entries giving only the name.
```javascript
{
  "message": "Busqueda encontrada exitosamente",
  "data": [{
    "name": "this is the name",
    "links": [
      { "rel": "self", "href": "/api/coffee/:id", "type": "GET" },
      { "rel": "edit", "href": "/api/coffee/:id/edit", "type": "POST" },
      { "rel": "delete", "href": "/api/coffee/:id/delete", "type": "DELETE" },
      { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
      { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
      { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
  }, {
    "name": "this is the name",
    "links": [
      { "rel": "self", "href": "/api/coffee/:id", "type": "GET" },
      { "rel": "edit", "href": "/api/coffee/:id/edit", "type": "POST" },
      { "rel": "delete", "href": "/api/coffee/:id/delete", "type": "DELETE" },
      { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
      { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
      { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
  }, {
    "name": "other",
    "links": [
      { "rel": "self", "href": "/api/coffee/:id", "type": "GET" },
      { "rel": "edit", "href": "/api/coffee/:id/edit", "type": "POST" },
      { "rel": "delete", "href": "/api/coffee/:id/delete", "type": "DELETE" },
      { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
      { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
      { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
  }, {
    "name": "expensive",
    "links": [
      { "rel": "self", "href": "/api/coffee/:id", "type": "GET" },
      { "rel": "edit", "href": "/api/coffee/:id/edit", "type": "POST" },
      { "rel": "delete", "href": "/api/coffee/:id/delete", "type": "DELETE" },
      { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
      { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
      { "rel": "count", "href": "/api/coffee/count", "type": "GET" } ],
  }],
}
```
<br/>

*NOTE:* Hateoas was unable to insert the id in the hyperlinks (href attribute) because the id column was not asked for. You need to ask for the id attribute for the correct link. For instance:

```javascript
Requestify.get(`http://localhost:3000/api/coffee/find?columns=["id","name"]`);
```
<br/>

Will return all the entries giving their name and id, with all the hateoas correctly compiled.

```javascript
{
  "message": "Busqueda encontrada exitosamente",
  "data": [{
      "id": 1,
      "name": "this is the name",
      "links": [{ "rel": "self", "href": "/api/coffee/1", "type": "GET"},
        { "rel": "edit", "href": "/api/coffee/1/edit", "type": "POST"},
        { "rel": "delete", "href": "/api/coffee/1/delete", "type": "DELETE"},
        { "rel": "new", "href": "/api/coffee/new", "type": "POST"},
        { "rel": "all", "href": "/api/coffee/find", "type": "GET"},
        { "rel": "count", "href": "/api/coffee/count", "type": "GET"}],
    },
    {
      "id": 2,
      "name": "this is the name",
      "links": [{ "rel": "self", "href": "/api/coffee/2", "type": "GET"},
        { "rel": "edit", "href": "/api/coffee/2/edit", "type": "POST"},
        { "rel": "delete", "href": "/api/coffee/2/delete", "type": "DELETE"},
        { "rel": "new", "href": "/api/coffee/new", "type": "POST"},
        { "rel": "all", "href": "/api/coffee/find", "type": "GET"},
        { "rel": "count", "href": "/api/coffee/count", "type": "GET"}],
    },
    {
      "id": 3,
      "name": "other",
      "links": [{ "rel": "self", "href": "/api/coffee/3", "type": "GET"},
        { "rel": "edit", "href": "/api/coffee/3/edit", "type": "POST"},
        { "rel": "delete", "href": "/api/coffee/3/delete", "type": "DELETE"},
        { "rel": "new", "href": "/api/coffee/new", "type": "POST"},
        { "rel": "all", "href": "/api/coffee/find", "type": "GET"},
        { "rel": "count", "href": "/api/coffee/count", "type": "GET"}],
    },
    {
      "id": 4,
      "name": "expensive",
      "links": [{ "rel": "self", "href": "/api/coffee/4", "type": "GET" },
        { "rel": "edit", "href": "/api/coffee/4/edit", "type": "POST" },
        { "rel": "delete", "href": "/api/coffee/4/delete", "type": "DELETE" },
        { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
        { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
        { "rel": "count", "href": "/api/coffee/count", "type": "GET"}],
    }
  ],
}
```
<br/>

##### **Advance Options:**  

It just does not end here! There are some more options to do your querying even more complete!

##### **&nbsp;Start Date and End Date:**  

You can specify a range of dates to query. It will filter all the values where startDate < created_at < endDate. If startDate it is not defined it will query since dawn of time, whereas if endDate is not defined it will query till the end of time.

```javascript
Requestify.get(`http://localhost:3000/api/coffee/find?columns=["id","created_at"]&startDate=2018-11-21T11:55:00.000Z&endDate=2018-11-21T12:00:00.000Z`);
```
<br/>

Will return all the entries created between 11:55 AM 21/11/2018 and 12:00 PM 21/11/2018. Note it will only return the id and created_at.

```javascript
{
  "message": "Busqueda encontrada exitosamente",
  "data": [{
      "id": 2,
      "created_at": "2018-11-21T11:57:02.767Z",
      "links": [{ "rel": "self", "href": "/api/coffee/2", "type": "GET"},
        { "rel": "edit", "href": "/api/coffee/2/edit", "type": "POST"},
        { "rel": "delete", "href": "/api/coffee/2/delete", "type": "DELETE"},
        { "rel": "new", "href": "/api/coffee/new", "type": "POST"},
        { "rel": "all", "href": "/api/coffee/find", "type": "GET"},
        { "rel": "count", "href": "/api/coffee/count", "type": "GET"}],
    }],
}
```
<br/>

##### **&nbsp;order By, limit and offset:**

There are more options, for instance:
```javascript
Requestify.get(`http://localhost:3000/api/coffee/find?columns=["id"]&orderBy=id&limit=2`);
```
<br/>

It will get the first two entries ids ordered by id.

```javascript
{
  "message": "Busqueda encontrada exitosamente",
  "data": [{
      "id": 1,
      "links": [{ "rel": "self", "href": "/api/coffee/1", "type": "GET"},
        { "rel": "edit", "href": "/api/coffee/1/edit", "type": "POST"},
        { "rel": "delete", "href": "/api/coffee/1/delete", "type": "DELETE"},
        { "rel": "new", "href": "/api/coffee/new", "type": "POST"},
        { "rel": "all", "href": "/api/coffee/find", "type": "GET"},
        { "rel": "count", "href": "/api/coffee/count", "type": "GET"}],
    }, {
        "id": 2,
        "links": [{ "rel": "self", "href": "/api/coffee/2", "type": "GET"},
          { "rel": "edit", "href": "/api/coffee/2/edit", "type": "POST"},
          { "rel": "delete", "href": "/api/coffee/2/delete", "type": "DELETE"},
          { "rel": "new", "href": "/api/coffee/new", "type": "POST"},
          { "rel": "all", "href": "/api/coffee/find", "type": "GET"},
          { "rel": "count", "href": "/api/coffee/count", "type": "GET"}],
    }],
}
```
<br/>

Moreover, you can set orderBy as an array, not only specifying the column to order by but also if its ascending (asc) or descending (desc). To do so, orderBy is defined as column to order and then the direction that can either be: "asc" or "desc". for instance:

```javascript
Requestify.get(`http://localhost:3000/api/coffee/find?columns=["id"]&orderBy=["id","desc"]&limit=2`);
```
<br/>

It will get the second and third entries ids ordered by id in descending order:

```javascript
{
  "message": "Busqueda encontrada exitosamente",
  "data": [{
      "id": 3,
      "links": [{ "rel": "self", "href": "/api/coffee/3", "type": "GET"},
        { "rel": "edit", "href": "/api/coffee/3/edit", "type": "POST"},
        { "rel": "delete", "href": "/api/coffee/3/delete", "type": "DELETE"},
        { "rel": "new", "href": "/api/coffee/new", "type": "POST"},
        { "rel": "all", "href": "/api/coffee/find", "type": "GET"},
        { "rel": "count", "href": "/api/coffee/count", "type": "GET"}],
    }, {
        "id": 2,
        "links": [{ "rel": "self", "href": "/api/coffee/2", "type": "GET"},
          { "rel": "edit", "href": "/api/coffee/2/edit", "type": "POST"},
          { "rel": "delete", "href": "/api/coffee/2/delete", "type": "DELETE"},
          { "rel": "new", "href": "/api/coffee/new", "type": "POST"},
          { "rel": "all", "href": "/api/coffee/find", "type": "GET"},
          { "rel": "count", "href": "/api/coffee/count", "type": "GET"}],
    }],
}
```
<br/>

This does not ends here, if you need to order by id decreasing and the by nace ascending, the following query will do the trick: 

```javascript
Requestify.get(`http://localhost:3000/api/coffee/find?columns=["id"]&orderBy=[["id","desc"],["name", "asc"]]&limit=2`);
```
<br/>

You can order by as many variables as you need, just add one extra array indicating the variable name and order.


##### **&nbsp;rawSelect:**

RawSelect allows you to be even more specific on what you want to ask for. It can be given as a string or an array for sql injection. Fo instance:

```javascript
Requestify.get(`http://localhost:3000/api/coffee/find?limit=1&rawSelect=EXTRACT(MONTH FROM created_at) as month`);
```
<br/>

Will extract the month. Note it also brings all the attributes, if you just want to extract the month, you should also add the _clearSelect_ option.

```javascript
{
"message": "Busqueda encontrada exitosamente",
"data": [{
    "month": 11,
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
    }],
}
```
<br/>

Same request, with clearSelect and with rawSelect as an array:

```javascript
Requestify.get(`http://localhost:3000/api/coffee/find?limit=1&rawSelect=["EXTRACT(MONTH from ??) as month", "created_at"]&clearSelect=true`);
```
<br/>

```javascript
{
"message": "Busqueda encontrada exitosamente",
"data": [{
    "month": 11,
    "links": [
      { "rel": "self", "href": "/api/coffee/:id", "type": "GET" },
      { "rel": "edit", "href": "/api/coffee/:id/edit", "type": "POST" },
      { "rel": "delete", "href": "/api/coffee/:id/delete", "type": "DELETE" },
      { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
      { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
      { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
    }],
}
```
<br/>


#### GET /relation_name/count {#count-api}

##### **Description:**

This would allow you to count how many entries are there. Extremely useful for analytics and key metrics. Most of what has been said for find applies to count requests, with simple Queries, Complex Queries, raw Query and advance options such us startDate, endDate and rawSelect.

##### **Simple Queries:**

```javascript
Requestify.get('http://localhost:3000/api/coffee/count?price=100');
```
<br/>

Will return:

```javascript
{
  "message": "Busqueda encontrada exitosamente",
  "data": "2"
}
```
<br/>

##### **Complex Queries:**

```javascript
Requestify.get('http://localhost:3000/api/coffee/count?price=[">", 105]');
```
<br/>

Returns:

```javascript
{
  "message": "Busqueda encontrada exitosamente",
  "data": 1
}
```
<br/>

##### **Raw Query:**

```javascript
Requestify.get(`http://localhost:3000/api/coffee/count?rawWhere=["name = ? or name = ? ", ["expensive", "other"]]`);
```
<br/>

Returns:

```javascript
{
  "message": "Busqueda encontrada exitosamente",
  "data": 2
}
```
<br/>

##### **Advanced Options:**

##### **&nbsp;Start Date and End Date:**

```javascript
Requestify.get(`http://localhost:3000/api/coffee/count?startDate=2018-11-21T11:55:00.000Z&endDate=2018-11-21T12:00:00.000Z`);
```
<br/>

Returns:

```javascript
{
  "message": "Busqueda encontrada exitosamente",
  "data": 1
}
```
<br/>

##### **&nbsp;Group by and order By:**

There is an extra option that was not present in the find examples: _groupBy_. You can group your answer according to an attribute.
For instance:

```javascript
Requestify.get(`http://localhost:3000/api/coffee/count?groupBy=name`);
```
<br/>

Will return how many entries are there per each name.

```javascript
{
  "message": "Busqueda encontrada exitosamente",
  "data": [
      {
    "count": 2,
    "name": "this is the name"
    },
      {
    "count": 1,
    "name": "other"
    },
      {
    "count": 1,
    "name": "expensive"
  }],
}
```
<br/>

You can also order this answers:

```javascript
Requestify.get(`http://localhost:3000/api/coffee/count?groupBy=name&orderBy=count`);
```
<br/>

Will return the save results as before but ordered by count in ascending order.
```javascript
{
  "message": "Busqueda encontrada exitosamente",
  "data": [{
    "count": 1,
    "name": "other"
    }, {
    "count": 1,
    "name": "expensive"
  }, {
    "count": 2,
    "name": "this is the name"
    }],
}
```
<br/>

##### **&nbsp;rawSelect:**

There rawSelect option its also valid. However, be caution when using it because sometimes it will not be valid if its does not came with a group By.
Here an example:

```javascript
Requestify.get(`http://localhost:3000/api/coffee/count?groupBy=minute&rawSelect=EXTRACT(minutes from created_at) as minutes`);
```
<br/>

Will return how many entries were created grouped by the minute of there creation.

```javascript
{
  "message": "Busqueda encontrada exitosamente",
  "data": [{
    "count": 1,
    "minutes": 57
    }, {
    "count": 2,
    "minutes": 6
  }, {
    "count": 1,
    "minutes": 54
  }],
}
```
<br/>


#### PUT PATCH POST /relation_name/:id/edit

##### **Description:**
This URL can be called either with PUT, PATCH or POST. It receives a JSON object and, in the database, updates the values defined in the JSON for the entry with id = :id. It will response if it was successful the update and the entry updated.

##### **Example:**

The following:              
```javascript
Requestify.post('http://localhost:3000/api/coffee/2/edit', {name: 'this is an updated name', price: 80});
```
<br/>

Will change in the database the entry with id = 2 in the relation relation_name the values with name and price to "this is an updated name" and 80.

It will return the updated entry:

```javascript
{
  "message": "Elemento actualizado exitosamente",
  "data": {
    "id": 2,
    "name": "this is an updated name",
    "price": 80,
    "created_at": "2018-11-21T11:57:02.767Z",
    "updated_at": "2018-12-12T11:52:32.750Z",
    "links": [
      { "rel": "self", "href": "/api/coffee/2", "type": "GET" },
      { "rel": "edit", "href": "/api/coffee/2/edit", "type": "POST" },
      { "rel": "delete", "href": "/api/coffee/2/delete", "type": "DELETE" },
      { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
      { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
      { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
  }
}
```
<br/>


The following:              
```javascript
Requestify.post('http://localhost:3000/api/coffee/2/edit', {price: 90});
```
<br/>

Will change in the database the entry with id = 2 in the relation relation_name the value price to 80 and leave the name intact.

```javascript
{
  "message": "Elemento actualizado exitosamente",
  "data": {
    "id": 2,
    "name": "this is an updated name",
    "price": 90,
    "created_at": "2018-11-21T11:57:02.767Z",
    "updated_at": "2018-12-12T11:55:59.828Z",
    "links": [
      { "rel": "self", "href": "/api/coffee/2", "type": "GET" },
      { "rel": "edit", "href": "/api/coffee/2/edit", "type": "POST" },
      { "rel": "delete", "href": "/api/coffee/2/delete", "type": "DELETE" },
      { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
      { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
      { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
  }
}
```
<br/>


#### DELETE /relation_name/:id

In the database deletes the entry with id = :id.

The following:              
```javascript
  Requestify.delete('http://localhost:3000/api/relation_name/2');
```
<br/>

Will delete in the database the entry with id = 2, and return the deleted element.

```javascript
{
  "message": "Elemento eliminado exitosamente",
  "data": {
    "id": 2,
    "name": "this is an updated name",
    "price": 90,
    "created_at": "2018-11-21T11:57:02.767Z",
    "updated_at": "2018-12-12T11:55:59.828Z",
    "links": [
      { "rel": "self", "href": "/api/coffee/2", "type": "GET" },
      { "rel": "edit", "href": "/api/coffee/2/edit", "type": "POST" },
      { "rel": "delete", "href": "/api/coffee/2/delete", "type": "DELETE" },
      { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
      { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
      { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
  }
}
```
<br/>

### Working with the generated web app: {#web-app}

Chinchay gives you a fully-functional API to play around. But also it provides a web app to create, edit, and view your entries. This web app is just a frontend that makes API calls to the [generated API](#generated-api)

#### web index

If you navigate to [http://localhost:3000/relation_name](http://localhost:3000/relation_name) ([http://localhost:3000/coffee](http://localhost:3000/coffee) in our case) you will see a table were every row is one entry from the database.
On every column you can click [show](#web show) to view a page that render that particular entry or [edit](#web edit) to redirect to a page where you can edit that entry.

On the bottom you have a [new](#web new) button to go and create a new entry!

The file renderer is named index.ejs, view the [views section](#views) for more details.

#### web new

If you navigate to http://localhost:3000/relation_name/new you will see a form. It will have inputs to define all the columns of a given relation except for id, created_at and updated_at. Click save to save this entry!

It will render the file named create.ejs, view the [views section](#views) for more details.


#### web show

If you navigate to http://localhost:3000/relation_name/:id you will see all the information regarding the entry with id = :id. You can click [edit](#web edit) to edit that entry or [index](#web index) to go back to the index.

It will render the file named show.ejs, view the [views section](#views) for more details.

#### web edit

If you navigate to http://localhost:3000/relation_name/:id/edit you will see a form to edit the information regarding the entry with id = :id. It is very similar to the form of [new](#web new), you will not be able to edit the id, created_at nor updated_at. You can click [update](#web edit) to edit that entry.

It will render the file named edit.ejs, view the [views section](#views) for more details.


### The "new" Command {#new-command}

This command will create a migration, a model, a controller, several views and two routes files for a given relation. Basically with just one command you are all set to for the CRUD (create, read, update, delete) of than relation. You can use it by running:

```
$ chinchay new relation_name
```

Where relation_name is the name of the relation you want to work with.

#### Migration

A migration file will be created on the directory specified in the knexfile. If you are unfamiliar of how knexfile or knex works see the [knex documentation](https://knexjs.org/).

But, in a glance, knex uses migrations to make changes to the database schema. For every change you want to make, you create a migration file.
This file has two main methods: _up_ and _down_. The change to the database must be included in the _up_ method, whereas the _down_ method should contain code to reverse the change. Therefore you can go back and forth a migration running the _down_ and _up_ method.
The main commands that knex uses here are:

```
$ knex migrate:latest
```
<br/>
This will run all the _up_ methods of the migration files. It will register which migrations has ran, therefore if you create more migration and then run this command again, only the new migrations will be run.
```
$ knex migrate:rollback
```
<br/>
This will run all the _down_ methods of the migration files. Its kind of an "undo" for the previous command.
```
$ knex migrate:make migration_name
```
<br/>
This will create a new migration file called _migration_name_.

When you run:
```
$ chinchay new relation_name
```
<br/>
A migration file is created as if you had ran:
```
$ knex migrate:make relation_name
```
<br/>

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
<br/>
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
<br/>

Go to the [knex documentation](https://knexjs.org/) for more info of how to work around migrations.

Dont forget to run: `$ knex migrate:latest ` in order for the migration to take place!

#### Routes

The command will generate two files of routes to work around with the [web app](#web-app) and the [API](#generated-api). Both files are created within the directory specified in the [chainfile](#chainfile). By default, it will be in the directory: `./routes/`

The file relationName.js contains all the routes for the [web app](#web-app) and relationNameAPI.js contains all the routes for the [API](#generated-api).

Don't forget to include this files in the app.js file:

```javascript
var relation_name = require('./routes/relation_name');
var relation_nameAPI = require('./routes/relation_nameAPI');
app.use('/', relation_name);
app.use('/', relation_nameAPI);
```
<br/>

#### Views

The command will generate a folder with four files to render the [web app](#web-app) and the [API](#generated-api). This folder will be named `relation_name` and created within the directory specified in the [chainfile](#chainfile). By default, it will be in the directory: `./views/`.

Each files uses ejs to generate the html file. Feel free to visit the [ejs website](https://ejs.co/) for further information on how to work with ejs. But in a nutshell, it allows you to embed javascript within <%%> tags.

The four files created are the following:

1. create.js: File to render a form to create a new entry. As input it receives a JSON object representing an empty instance of the relation. Note line 12 is filtering that you cannot set the id, created_at nor updated_at. This is the file rendered when the [web new](#web new) URL is visited.
2. edit.js: File to render a form to edit a given entry. As input it receives a JSON object representing the object to edit. Note line 12 is filtering that you cannot set the id, created_at nor updated_at. This is the file rendered when the [web edit](#web edit) URL is visited.
3. index.js: File that shows a table with all the entries from the relation Render in [web index](#web index). Receives an Array of JSON objects, each object representing an entry on the database. This is the file rendered when the [web index](#web index) URL is visited.
4. show.js: File renders a table to show the value of every variable of the object. Receives a JSON object representing the entry to show. This is the file rendered when the [web show](#web show) URL is visited.
<br/>

#### Controller
The command will generate one controller file within the directory specified in the [chainfile](#chainfile). By default, it will be in the directory: `./controllers/`. This file  _sticks_ all together. It is called from the [Router](#routes), then calls the [Model](#model) to get the requested information and then send the information back to the client either in the [views](#views) or in JSON objects.

Before it calls the [Model](#model) it extract from the request what is being asked for. This information is passed in three different ways:

1. Params: This are the _parameters_ of the request. To know there value you need to do: ` req.params `. They are defined within the URL. For instance, if the [show](#web_show) url is _/relation_name/:id_, meaning that to view the entry with id = 1 you have to visit the url _/relation_name/1_. The controller knows which entry to extract by looking in to the params, i.e: ` req.params.id `.
2. . Query:  This is the _query_ of the request. To know its value you need to do: ` req.query `.This is the information given after the URL, it is separated from the URL by a '?' character.  For instance:  _/api/relation_name/find?price=100_ has the query: _price=100_. ThThe use of the query varies, but usually is used to filter what to be shown.
3. Body: This is the _body_ of the request. To know its value you need to do: ` req.body `. This are not defined in the URL, they are given in the body. Usually is used to give more sensible or complex information. Note than the GET request cannot receive a body property.

It the case of the API calls: [find](#find-api), [find by id](#find-by-id-api) and [count](#count-api), the information is passed by the query and the its split into tree different objects: query, options and columns. If you are curious of what this is and how it works, visit the [Model Documentation]((/chinchay/models).

After the models are called information is send back to the client. In the case of the [web app](#web-app) this is done by calling the method ` res.render() `. This function receives two parameters, the first one is the file's path. The second one is all the information you what to pass to the _ejs_ in order to render, for instance in the case of [web show](#web show) an object called _result_ is passed. This object is JSON representing the entry to be displayed.

In the case of the [API](#generated-api) the information is passed out as a JSON. This JSON is build by the [httpResponse]((/codemaster/httpresponse). Feel free to visit its [documentation]((/codemaster/httpresponse) for more information. In a nutshell, the success functions receives three parameters, first a message to be given out, then the key used for the information and finally the values that key should have. Therefore:

```javascript
  httpResponse.success('This is the message', 'key', 'here goes the data');
```
<br/>
Will return:
```javascript
  {
    message: 'This is the message',
    key: 'here goes the data'
  }
```
<br/>

When an error occurs, the model response with an [Message object](/codemaster/message) of the [Codemaster](https://github.com/afontainec/codemaster) package. This message has three properties:

1. code: It uses [the Http Codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) to inform what "type" of error.
2. message: A message to inform what is the error.
3. fullMessage: This is the complete error.

With this message error, the response is build by calling httpResponse.error(..). For more information on this method visit [this link]((/codemaster/httpresponse). But in a nutshell, it receives two parameters. The first is the error to be informed to the client. Therefore it should be easy to understand for everyone. The second parameter is used for development environment. Its the full error that has been thrown. This is to help developers understand why it fell. However, in production environments, it will not be added. Therefore:

```javascript
  httpResponse.error('The entry you are looking does not exist', 'No entry with id = 3 was found in table "coffee"');
```
<br/>
In an development environment will return:
```javascript
  {
    error: 'The entry you are looking does not exist',
    fullError: 'No entry with id = 3 was found in table "coffee"'
  }
```
<br/>

Note that most of the api calls, also return a _links_ property. This links follows the [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS) component of a [REST application architecture](https://en.wikipedia.org/wiki/Representational_state_transfer). This mean it gives out all the links necessary to browse through the API. You can see how they are defined in the `javascript initializeHATEOAS() ` function. For more information on this, feel free to go to the [HateoasGenerator documentation](/chinchay/hateoasgenerator).


#### Model

Lastly, a model file is created. We *strongly* recommend to visit the [Model Documentation](/chinchay/models) to fully understand how to work with it. However, the file created its a [Singleton](https://www.dofactory.com/javascript/singleton-design-pattern) that manages all the queries to a certain relation. It extends the Table class and it has a constructor where it is specified the name of the table it should query to. If you need customize model functions, in this file you should add them.

### .chainfile.js {#chainfile}

This is the configuration file. Chinchay will provide a default file, therefore is _optional_. This file has the following structure:

```javascript
const path = require('path');

module.exports = {
  models: {
    directory: path.join(process.cwd(), 'models')
  },
  controllers: {
    directory: path.join(process.cwd(), 'controllers')
  },
  views: {
    directory: path.join(process.cwd(), 'views')
  },
  routes: {
    directory: path.join(process.cwd(), 'routes')
  },
  knex:  path.join(process.cwd(), 'knex.js')
};
```

* **models.directory:** Indicates in which directory the models will be saved.
* **controllers.directory:** Indicates in which directory the controllers will be saved.
* **routes.directory:** Indicates in which directory the routes will be saved.
* **knex:** Where knex is saved. It used to compute the path when requiring knex.
