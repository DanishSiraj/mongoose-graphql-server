Automatically generates a GraphQL Server from mongoose models. Supports deep nested queries.
Provides all the basic CRUD operations for all models on both native mongoose connection as well as created connections.
Uses [graphql-compose-mongooose](https://github.com/graphql-compose/graphql-compose-mongoose) under the hood.


- [Installation](#installation)
- [Example](#example)
  - [Running with Mongoose](#running-with-mongoose)
  - [Nested Populations](#nested-populations)
    - [With Model Names](#with-model-names)
    - [With Virtuals](#with-virtuals)
  - [Using Express Server](#using-express-server) 
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

Use the endpoint ```/graphql``` to open graphQL studio, and ```/voyager``` to check the graphql voyager.

### Running with Mongoose

```
const mongoose = require('mongoose');
const {
  generateSchema,
  createGraphQLServer,
} = require('mongoose-graphql-server');
const PORT = process.env.port || 3000;

mongoose.connect('mongodb://localhost/test');
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

#### Nested Populations
This package supports deep nested populations if using model names as refs or defining virtual fields on the models.

#### With Model Names
Define the first `User` model in `user.model.js` file 
```
const {model, Schema, Types} = require('mongoose');


const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    username: {
    type: String,
    required: true,
    indexed: true
    },
    isActive: {
      type: Boolean,
      default: true,
    }
    ,
    posts:[{
    type: Types.ObjectId,
    ref: "post",
    }]
    
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

const userModel = model('user', userSchema);
module.exports = userModel;
```
Define the second `Post` model in `post.model.js` file 
```
const {model, Schema,Types} = require('mongoose');

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ['CREATED', 'DRAFT', 'PUBLISHED'],
      required: true,
    },
    creator: {
      type: Types.ObjectId,
      ref:"user"
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);


const postModel = model('post', postSchema);
module.exports = postModel;
```
Create the server file `index.js`
```
const mongoose = require('mongoose');
const {
  generateSchema,
  createGraphQLServer,
} = require('mongoose-graphql-server');
const PORT = process.env.port || 3000;

mongoose.connect('mongodb://localhost/test1');
const db = mongoose.connection;

const init = async () => {

// Register models 
require('./user.model.js');
require('./post.model.js');

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
Run the server
```console
$ node index.js
```

#### With Virtuals
Define the first `User` model in `user.model.js` file 
```
const {model, Schema} = require('mongoose');

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.virtual('posts', {
  ref: 'post',
  foreignField: 'author_id',
  localField: '_id',
});


const userModel = model('user', userSchema);
module.exports = userModel;

```

Define the second `Post` model in `post.model.js` file 
```
const {model, Schema} = require('mongoose');

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ['CREATED', 'DRAFT', 'PUBLISHED'],
      required: true,
    },
    author_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

postSchema.virtual('author', {
  ref: 'user',
  foreignField: '_id',
  localField: 'author_id',
  justOne: true,
});

const postModel = model('post', postSchema);
module.exports = postModel;

```

Create the server file `index.js`
```
const mongoose = require('mongoose');
const {
  generateSchema,
  createGraphQLServer,
} = require('mongoose-graphql-server');
const PORT = process.env.port || 3000;

mongoose.connect('mongodb://localhost/test');
const db = mongoose.connection;

const init = async () => {

// Register models 
require('./user.model.js');
require('./post.model.js');

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

Run the server
```console
$ node index.js
```

### Using Express Server
This package uses express as the default server to serve the graphQl endpoint, the ```createGraphQLServer``` method returns an Express app instance.

#### Starting with the graphQl server
```
const mongoose = require('mongoose');
const {
  generateSchema,
  createGraphQLServer,
} = require('mongoose-graphql-server');
const PORT = process.env.port || 3000;

mongoose.connect('mongodb://localhost/test');
const db = mongoose.connection;

const init = async () => {

// Register models 
const Cat = mongoose.model('Cat', { name: String });
// Build the schema
const schema = generateSchema(mongoose);

// Create the graphQL server
const app = await createGraphQLServer(schema);

app.get("/",(req,res) => {
res.send("hello");
})

// Start the server
app.listen(PORT, () => {
      console.log(`🚀🚀🚀 The server is running at http://localhost:${PORT}/`);
});

}

db.once('open',init);
```
Run the server
```console
$ node index.js
```

#### Using preexisting express app
```

```

Find example to implement here at [examples repository](https://github.com/DanishSiraj/mongoose-graphql-examples)

## Issues
- At the moment populations are supported only on virtual fields and model names.
- Supports sort,filter and populations only on indexed fields at the moment.
- Populating key needs to be present for deep nested populations

## ToDo
- [x] Write the documentation
- [ ] Fix issues
- [ ] Support custom field generator on genrated schema
- [ ] Addition of custom query and mutation resolvers  
- [x] Converting this project to typescript
