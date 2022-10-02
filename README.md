Automatically generates a GraphQL Server from mongoose models. Supports deep nested queries using model virtual fields.
Provides all the basic CRUD operations for all models on both native mongoose connection as well as created connections.
Uses [graphql-compose-mongooose](https://github.com/graphql-compose/graphql-compose-mongoose) under the hood.


- [Installation](#installation)
- [Example](#example)
  - [Running with Mongoose](#standalone)
  - [Running with Express](#express) 
  - [Nested Populations](#nested-populations)
- [Known Issues](#issues)
- [ToDo List](#todo)

## Installation

Install with npm
```console
$ npm i mongoose-graphql-server --save
```

Install with yarn
```console
$ yarn add mongoose-graphql-server
```

## Example
### Running with Mongoose

```
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
const {
  generateSchema,
  createGraphQLServer,
} = require('mongoose-graphql-server');
const PORT = process.env.port || 3000;
const db = mongoose.connection;

const init = async () => {

// Register models 

const Cat = mongoose.model('Cat', { name: String });

// Build the schema

const schema = generateSchema(mongoose);

// Create the graphQL server

const app = await createGraphQLServer(schema);

// Start the server

app.listen(PORT, () => {
      console.log(`🚀🚀🚀 The server is running at http://localhost:${PORT}/`);
});

}

db.once('open',init);
```
Find example to implement here at [examples repository](https://github.com/DanishSiraj/mongoose-graphql-examples)

## Issues
- Supports sort,filter and populations only on indexed fields at the moment
- Populating key needs to be present for deep nested populations

## ToDo
- [ ] Write the documentation
- [ ] Fix issues
- [ ] Support custom field generator on genrated schema
- [ ] Addition of custom query and mutation resolvers  
