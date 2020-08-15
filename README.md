# Chinchay [![Build Status](https://travis-ci.com/afontainec/chinchay.svg?branch=master)](https://travis-ci.com/afontainec/chinchay) [![Coverage Status](https://coveralls.io/repos/github/afontainec/chinchay/badge.svg?branch=master)](https://coveralls.io/github/afontainec/chinchay?branch=master)

Building a web app is no easy task. The coding itself can be very time consuming and tedious, but it's not the trickiest part: having an organized file structure, following industry best practices, restricting access and managing HTTP status codes correctly is where development gets puzzling. But fear not! Chinchay will speed up your development making sure you end up with a top-notch web app. 

Going technical, [Chinchay](https://www.npmjs.com/package/chinchay) is a npm package that works on top of [express.js](https://expressjs.com/) (and therefore [node.js](https://nodejs.org/es/)) and connects to a [postgreSQL](https://www.postgresql.org/) database through [knex.js](http://knexjs.org/), a SQL query builder.

### So what does Chinchay actually do?

* Use [Chinchay’s CLI](./docs/cli) to automate [CRUD](https://www.codecademy.com/articles/what-is-crud) (Create, Read, Update, Delete) operations. It will follow a [MVC(Model View Controller)](https://techterms.com/definition/mvc) architecture pattern. With it, I can assure you coding will not be tedious nor time consuming. Chinchay tries not to be highly-opinionated and favours flexibility, therefore is fully customizable through the [.chainfile.js](./docs/chainfile).  
* [Chinchay’s CLI](./docs/cli) will create an API following the [REST](https://restfulapi.net/) application architecture.
* If you do not use the Chinchay CLI, Chinchay does offer a [HATEOAS generator](./docs/hateoas) that can be added to your API, one step forward towards a RESTful API. 
* Chinchay provides an [ErrorHandler](./errorhandler/) to manage HTTP status codes, returning meaningful messages and codes.
* Protect your app, so that only authorized users access the data. Use Chinchay [Access Module](./middleware/access), [Chinchay’s middleware](./middleware/middleware) and Chinchay’s sister package [TheWall](https://www.npmjs.com/package/thewall) to fully control who can access what. See the [API tutorial](./gettingstarted/apiMiddleware) for a complete guide!
* Chinchay’s CLI will also create Frontend views to work with the generated API. It can either be with [ejs](https://ejs.co/) or [Angular](https://angular.io/). [Currently working in more frontend options!]
*  Chinchay allows API clients to customize their queries. With just a couple of endpoints and a very simple syntax, API clients can query what they need. Obviously this can be limited and disabled as needed. See [API: Client Querying](./docs/clientside) for more!
* Last, But definitely not least, Chinchay offers a flexible and extendable [Table Gateway Model](./models/). To organize and manage your database queries without even knowing any SQL.

### Getting Started

So what are you waiting for?? Go to the [getting started section](./gettingstarted/) to begin your journey with Chinchay!

Here some quick links:

*  [See our tutorials to get started!](./gettingstarted)
*  [See the detailed Documentation](./docs)
*  [the full docs of our table gateway model](./table-gateway)
*  [Protect your routes with our middleware](./middleware)
*  [Manage your http responses with our ErrorHandler](./errorhandler)
*  [Any help is welcome! If you want to collaborate see our collaboration manual!](./collaborate)


### Collaborate

Any Contribution are welcome!

* [Github Repository](https://github.com/afontainec/chinchay)
* [Issues](https://github.com/afontainec/chinchay/issues)
* [Pull Requests](https://github.com/afontainec/chinchay/pulls)

For more information visit the [Chinchay website](http://chinchay.accionet.net)
