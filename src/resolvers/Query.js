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
  const quizzes = await ctx.models.Quiz.find({})
    .populate('user')
    .populate('question');

  return quizzes;
};

const oneQuiz = async (_, args, ctx) => {
  // TODO add error handling
  const quiz = await ctx.models.Quiz.findById(args.id)
    .populate('user')
    .populate('questions');

  return quiz;
};

// questions
const allQuestions = async (_, args, ctx) => {
  // TODO add error handling
  const questions = await ctx.models.Question.find({}).populate('quiz');

  return questions;
};

const oneQuestion = async (_, args, ctx) => {
  // TODO add error handling
  const question = await ctx.models.Question.findById(args.id).populate('quiz');

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
