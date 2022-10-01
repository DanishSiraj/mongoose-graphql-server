const mongoose = require('mongoose');
const connections = {};

const connectDatabases = async () => {
  connections.test1 = await mongoose.connect('mongodb://localhost/test1');
  connections.test2 = await mongoose.createConnection(
    'mongodb://localhost/test2'
  );
};

module.exports = {connectDatabases, connections};
