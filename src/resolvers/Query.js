// users
const allUsers = async (_, args, ctx) => {
  const users = await ctx.models.User.find({});

  return users;
};

const oneUser = async (_, args, ctx) => {
  const user = await ctx.models.User.findOne({ username: args.username });

  return user;
};

// quizzes
const allQuizzes = async (_, args, ctx) => {
  // TODO add error handling
  const quizzes = ctx.models.Quiz.find({});

  return quizzes;
};

const oneQuiz = async (_, args, ctx) => {
  // TODO add error handling
  const quiz = ctx.models.Quiz.findById(args.id);

  return quiz;
};

// questions
const allQuestions = async (_, args, ctx) => {
  // TODO add error handling
  const questions = ctx.models.Question.find({});

  return questions;
};

const oneQuestion = async (_, args, ctx) => {
  // TODO add error handling
  const question = ctx.models.Question.findById(args.id);

  return question;
};

export default {
  allUsers,
  oneUser,
  allQuizzes,
  oneQuiz,
  allQuestions,
  oneQuestion,
};
