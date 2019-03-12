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

Where _relation_name_ is the name of the relation you want to set the CRUD operations.

This command will create 2 route files, 1 controller, 1 model, 4 views files and 1 migration file. We will explain how to workaround each file created. You can modify the directory where they were saved by creating a .chainfile.js, feel free to go to [chainfile section](#.chainfile) for more information.


We need to declare the schema of our relation, we do this in the migration file. Go ahead and do so, if you don't have a clue of what are we talking about, check our [migration section](#migration). Don't forget to run: `$ knex migrate:latest`

Lastly we add to the app.js file the routes by adding the following lines:

```javascript
var relation_name = require('./routes/relation_name');
var relation_nameAPI = require('./routes/relation_nameAPI');
app.use('/', relation_name);
app.use('/', relation_nameAPI);
```
<br/>

You can run:
```
$ npm start
```
 <br/>
 Browse to [http://localhost:3000/relation_name](http://localhost:3000/relation_name) to start working with your Chinchay app!


### Working with the generated API: {#generated-api}

Chinchay will build a fully functional api so you can start working with your CRUD operation. Here is a list of the URL created and examples of how to work with them:

<br/>
#### POST /api/relation_name/new
<br/>
##### **Description:**
 Receives a JSON object and, in the database, inserts an entry with values defined in the JSON. It will return whether it was successful or not, and the saved entry.
##### **Example:**
  _NOTE:_ For all the examples, we will assume that the relation has a column _name_ of type string and a column _price_ of type integer. This should be defined in the [migration file](#migration).

The following:              
```javascript
Requestify.post('http://localhost:3000/api/relation_name/new', {name: "this is the name", price: 100});
```
<br/>
Will save in the database an entry were _name="this is the name"_ and _price=100_ in the relation _relation_name_. The Return is as follows:

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
<br/>

The following:              
```javascript
Requestify.post('http://localhost:3000/api/relation_name', {name: "this is the name"});
```
<br/>

Will save in the database an entry,  were _name="this is the name"_ and _price=null_, in the relation _relation_name_. The response is:

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
<br/>
In both cases, the return is an JSON object with a message and a data attribute with a JSON object representing the saved entry.
<br/>

#### GET /api/relation_name/:id
<br/>
##### **Description:**
Returns a JSON object representing the object with id = :id. If there is no such entry, it reports the error.
##### **Example:**

The following:              
```javascript
Requestify.get('http://localhost:3000/api/relation_name/1');
```
<br/>

Will return a JSON representing the object with id=1:

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
<br/>


#### GET /api/relation_name/find

##### **Description:**
Returns an array with all the entries matching the given query. If the query its empty it will return all the entries.
##### **Simple Queries:**
Here are some examples of how to work with simple queries: The query will filter with the given format _key=value_.

&nbsp;&nbsp; **1. Get all:**     
    If no query is defined, it will return all the elements.
      ````javascript
      Requestify.get('http://localhost:3000/api/relation_name/find');
      ````
      <br/>

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
              }
            ],
    }
    ```
    <br/>


&nbsp;&nbsp; **1. Filter with query:**     
    This is the simplest but powerful way of querying, the query will filter with the given format _key=value_.

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

```javascript
Requestify.get("http://localhost:3000/api/coffee/find?rawWhere=name = 'expensive' or name = 'other'");
```

Will return all the entries where name = 'other' or name = 'expensive'.
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


However, if you want to specify in an array-format you could run the following command:

And this will have the same return:

```javascript
Requestify.get(`http://localhost:3000/api/coffee/find?rawWhere=["name = ? or name = ? ", ["expensive", "other"]]`);
```

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



##### **Columns:**


Sometimes we don't want to get all the information, just the essential stuff. The columns options comes handy. In an array you can specify all the columns you want to get.

For instance, the following:

```javascript
Requestify.get("http://localhost:3000/api/coffee/find?columns=name");
```

Will return all the entries giving only the name.
```JSON
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

*NOTE:* Hateoas was unable to insert the id in the hyperlinks (href attribute) because the id column was not asked for. You need to ask for the id attribute for the correct link. For instance:

```javascript
Requestify.get(`http://localhost:3000/api/coffee/find?columns=["id","name"]`);
```

Will return all the entries giving their name and id, with all the hateoas correctly compiled.

```JSON
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

##### **Advance Options:**  

It just does not end here! There are some more options to do your querying even more complete!

###### **Start Date and End Date:**  

You can specify a range of dates to query. It will filter all the values where startDate < created_at < endDate. If startDate it is not defined it will query since dawn of time, whereas if endDate is not defined it will query till the end of time.

```javascript
Requestify.get(`http://localhost:3000/api/coffee/find?columns=["id","created_at"]&startDate=2018-11-21T11:55:00.000Z&endDate=2018-11-21T12:00:00.000Z`);
```

Will return all the entries created between 11:55 AM 21/11/2018 and 12:00 PM 21/11/2018. Note it will only return the id and created_at.

```JSON
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

###### **order By, limit and offset:**

There are more options, for instance:
```javascript
Requestify.get(`http://localhost:3000/api/coffee/find?columns=["id"]&orderBy=id&limit=2`);
```

It will get the first two entries ids ordered by id.

```JSON
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

Moreover, you can set orderBy as an array, not only specifying the column to order by but also if its ascending (asc) or descending (desc). To do so, orderBy is defined as column to order and then the direction that can either be: "asc" or "desc". for instance:

```javascript
Requestify.get(`http://localhost:3000/api/coffee/find?columns=["id"]&orderBy=["id","desc"]&limit=2`);
```

It will get the second and third entries ids ordered by id in descending order:

```JSON
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


###### **rawSelect:**

RawSelect allows you to be even more specific on what you want to ask for. It can be given as a string or an array for sql injection. Fo instance:

```javascript
Requestify.get(`http://localhost:3000/api/coffee/find?limit=1&rawSelect=EXTRACT(MONTH FROM created_at) as month`);
```

Will extract the month. Note it also brings all the attributes, if you just want to extract the month, you should also add the _clearSelect_ option.

```JSON
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

Same request, with clearSelect and with rawSelect as an array:

```javascript
Requestify.get(`http://localhost:3000/api/coffee/find?limit=1&rawSelect=["EXTRACT(MONTH from ??) as month", "created_at"]&clearSelect=true`);
```

```JSON
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


#### GET /relation_name/count

##### **Description:**

This would allow you to count how many entries are there. Extremely useful for analytics and key metrics. Most of what has been said for find applies to count requests, with simple Queries, Complex Queries, raw Query and advance options such us startDate, endDate and rawSelect.

##### **Simple Queries:**

```javascript
Requestify.get('http://localhost:3000/api/relation_name/count?price=100');
```

Will return:

```JSON
{
  "message": "Busqueda encontrada exitosamente",
  "data": "2"
}
```

##### **Complex Queries:**

```javascript
Requestify.get('http://localhost:3000/api/relation_name/count?price=[">", 105]');
```

```JSON
{
  "message": "Busqueda encontrada exitosamente",
  "data": 1
}
```

##### **Raw Query:**

```javascript
Requestify.get(`http://localhost:3000/api/coffee/count?rawWhere=["name = ? or name = ? ", ["expensive", "other"]]`);
```

```JSON
{
  "message": "Busqueda encontrada exitosamente",
  "data": 2
}
```

##### **Advanced Options:**

###### **Start Date and End Date:**

```javascript
Requestify.get(`http://localhost:3000/api/coffee/count?startDate=2018-11-21T11:55:00.000Z&endDate=2018-11-21T12:00:00.000Z`);
```

```JSON
{
  "message": "Busqueda encontrada exitosamente",
  "data": 1
}
```

###### **Group by and order By:**

There is an extra option that was not present in the find examples: _groupBy_. You can group your answer according to an attribute.
For instance:

```javascript
Requestify.get(`http://localhost:3000/api/coffee/count?groupBy=name`);
```

Will return how many entries are there per each name.

```JSON
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

You can also order this answers:

```javascript
Requestify.get(`http://localhost:3000/api/coffee/count?groupBy=name&orderBy=count`);
```

Will return the save results as before but ordered by count in ascending order.
```JSON
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

###### **rawSelect:**

There rawSelect option its also valid. However, be caution when using it because sometimes it will not be valid if its does not came with a group By.
Here an example:

```javascript
Requestify.get(`http://localhost:3000/api/coffee/count?groupBy=minute&rawSelect=EXTRACT(minutes from created_at) as minutes`);
```

Will return how many entries were created grouped by the minute of there creation.

```JSON
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


#### PUT PATCH POST /relation_name/:id/edit

##### **Description:**
This URL can be called either with PUT, PATCH or POST. It receives a JSON object and, in the database, updates the values defined in the JSON for the entry with id = :id. It will response if it was successful the update and the entry updated.

##### **Example:**

The following:              
```javascript
Requestify.post('http://localhost:3000/api/relation_name/2/edit', {name: 'this is an updated name', price: 80});
```

Will change in the database the entry with id = 2 in the relation relation_name the values with name and price to "this is an updated name" and 80.

It will return the updated entry:

```JSON
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


The following:              
```javascript
Requestify.post('http://localhost:3000/api/relation_name/2/edit', {price: 90});
```

Will change in the database the entry with id = 2 in the relation relation_name the value price to 80 and leave the name intact.

```JSON
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


#### DELETE /relation_name/:id

In the database deletes the entry with id = :id.

The following:              
```javascript
  Requestify.delete('http://localhost:3000/api/relation_name/2');
```

Will delete in the database the entry with id = 2, and return the deleted element.

```JSON
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

### Working with the generated web app:{#web-app}

Chinchay gives you a fully-functional API to play around. But also it provides a web app to create, edit, and view your entries. This web app is just a frontend that makes API calls to the [generated API](#generated-api)

#### web index

If you navigate to http://localhost:3000/relation_name you will see a table were every row is one entry from the database.
On every column you can click [show](#web show) to view a page that render that particular entry or [edit](#web edit) to redirect to a page where you can edit that entry.

On the bottom you have a [new](#web new) button to go and create a new entry!

It will render the file named index.ejs, view the [views section](#views) for more details.

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
This file has two main methods: _up_ and _down_. The change to the database must be included in the _up_ method where in the _down_ method code to reverse the change should be provided. Therefore you can go back and forth a migration running the _down_ and _up_ method.
The main commands that knex uses here are:

```
$ knex migrate:latest
```
This will run all the _up_ methods of the migration files. It will register which migrations has ran, therefore if you create more migration and then run this command again, only the new migrations will be run.
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

The command will generate two files of routes to work around with the [web app](#web-app) and the [API](#generated-api). Both files are created within the directory specified in the [chainfile](#chainfile). By default, it will be in the directory: `./routes/`

The file relationName.js contains all the routes for the [web app](#web-app) and relationNameAPI.js contains all the routes for the [API](#generated-api).

Don't forget to include this files in the app.js file:

```javascript
var relation_name = require('./routes/relation_name');
var relation_nameAPI = require('./routes/relation_nameAPI');
app.use('/', relation_name);
app.use('/', relation_nameAPI);
```

#### Views

The command will generate a folder with four files to render the [web app](#web-app) and the [API](#generated-api). This folder will be named `relation_name` and created within the directory specified in the [chainfile](#chainfile). By default, it will be in the directory: `./views/`.

Each files uses ejs to generate the html file. Feel free to visit the [ejs website](https://ejs.co/) for further information on how to work with ejs. But in a nutshell, it allows you to embed javascript within <%%> tags.

The four files created are the following:

1. create.js: File to render a form to create a new entry. render in [web new](#web new). As input it receives a JSON object representing an empty instance of the relation. Note line 12 is filtering that you cannot set the id, created_at nor updated_at.
2. edit.js: File to render a form to edit a given entry. render in [web edit](#web edit). As input it receives a JSON object representing the object to edit. Note line 12 is filtering that you cannot set the id, created_at nor updated_at.
3. index.js: File that shows a table with all the entries from the relation Render in [web index](#web index). Receives an Array of JSON objects, each object representing an entry on the database.
4. show.js: File renders a table to show the value of every variable of the object. render in [web show](#web show). Receives a JSON object representing the entry to show.

#### Controller

#### Model


### .chainfile.js {#chainfile}

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
