const express = require('express');
const cookieParser = require('cookie-parser');
const server = require('./server');
const connectDB = require('./db');

async function startServer() {
  const app = express();

  app.use(cookieParser());

  app.use((req, res, next) => {
    const { theme, token, activeQuiz, finalized, ...questions } = req.cookies;

    req.theme = theme || null;
    req.token = token || null;
    req.finalized = finalized || null;
    req.activeQuiz = activeQuiz || null;
    req.questions = questions || null;

    next();
  });

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

  app.get('/', (req, res, next) => {
    res.sendFile(`${__dirname}/views/welcome.html`);
  });

  app.get('/main.css', (req, res, next) => {
    res.sendFile(`${__dirname}/views/main.css`);
  });
}

startServer();
