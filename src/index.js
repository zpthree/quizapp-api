import express from 'express';
import server from 'server';
import connectDB from 'db';

async function startServer() {
  const app = express();

  await connectDB();

  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startServer();
