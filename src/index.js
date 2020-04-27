import express from 'express';
import server from 'server';
import connectDB from 'db';

// require('dotenv').config();

async function startServer() {
  const app = express();

  await connectDB();

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startServer();
