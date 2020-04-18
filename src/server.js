import { ApolloServer } from 'apollo-server-express';
import { importSchema } from 'graphql-import';
import resolvers from 'resolvers';
import models from 'models';
import db from 'db';

const typeDefs = importSchema(`src/resolvers/schema.graphql`);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: req => ({ ...req, db, models }),
});

export default server;
