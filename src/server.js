const { ApolloServer } = require('apollo-server-express');
const { importSchema } = require('graphql-import');
const resolvers = require('./resolvers');
const models = require('./models');

const typeDefs = importSchema(`src/schema.graphql`);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: req => ({ ...req, models }),
});

module.exports = server;
