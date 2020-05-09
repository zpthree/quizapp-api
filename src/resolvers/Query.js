const shuffleArray = require('../utils/shuffleArray');

async function appData(_, args, ctx) {
  const questionKeys = Object.keys(ctx.res.req.questions);
  const { theme, finalized, activeQuiz } = ctx.res.req;
  let answeredQuestions;
  let activeQuizId;
  let activeQuizTitle;

  if (activeQuiz) {
    const quiz = await ctx.models.Quiz.findOne({ slug: activeQuiz });
    activeQuizTitle = quiz.title;
    activeQuizId = quiz.id;
  }

  const questions = await ctx.models.Question.find()
    .where('_id')
    .in(questionKeys)
    .populate('quiz');

  const remainingQuestions = await ctx.models.Question.find({
    quiz: activeQuizId,
  })
    .where('_id')
    .nin(questionKeys);

  if (questions && questions[0]) {
    answeredQuestions = [
      ...questions.map(question => ({
        ...question._doc,
        id: question.id,
        answerId: ctx.res.req.questions[question.id],
      })),
    ];
  }

  return {
    theme,
    activeQuiz,
    finalized,
    activeQuizTitle,
    answeredQuestions,
    remainingQuestions,
  };
}

// users
async function allUsers(_, args, ctx) {
  // TODO add error handling
  const users = await ctx.models.User.find({});

  return users;
}

async function oneUser(_, args, ctx) {
  // TODO add error handling
  const user = await ctx.models.User.findOne({ username: args.username });

  return user;
}

// quizzes
async function allQuizzes(_, args, ctx) {
  // TODO add error handling
  const quizzes = await ctx.models.Quiz.find({})
    .populate('user')
    .populate('question');

  return quizzes;
}

async function oneQuiz(_, args, ctx) {
  // TODO add error handling
  const quiz = await ctx.models.Quiz.findOne({ slug: args.slug })
    .populate('user')
    .populate('questions');

  return quiz;
}

async function checkQuizSlug(_, args, ctx) {
  const [slugExists] = await ctx.models.Quiz.find({ slug: args.slug });

  if (slugExists) {
    throw Error('Slug is already being used by another quiz.');
  }

  return { message: 'Slug is available.' };
}

// questions
async function allQuestions(_, args, ctx) {
  // TODO add error handling
  const questions = await ctx.models.Question.find({}).populate({
    path: 'quiz',
    populate: 'user',
  });

  return questions;
}

async function oneQuestion(_, args, ctx) {
  // TODO add error handling
  const question = await ctx.models.Question.findById(args.id).populate({
    path: 'quiz',
    populate: 'user',
  });

  if (!question) {
    throw Error('The question you are looking for could not be found.');
  }

  const { answers } = question;
  const correctAnswer = answers.find(answer => answer.correct === true);

  let newAnswers = [correctAnswer];

  shuffleArray(answers).every(answer => {
    if (answer.correct === true) {
      return true;
    }

    // if (newAnswers.length >= question.answerCount) {
    //   return false;
    // }

    return (newAnswers = [...newAnswers, answer]);
  });

  return {
    ...question._doc,
    id: question.id,
    answers: shuffleArray(newAnswers),
  };
}

async function checkAnswer(_, args, ctx) {
  const question = await ctx.models.Question.findById(args.questionId);

  if (!question) {
    throw Error('Question not found.');
  }

  try {
    const correctAnswer = question.answers.find(
      answer => answer.correct === true
    );

    if (args.answerId !== correctAnswer.id) {
      return { correctAnswer, message: 'Answer is incorrect.' };
    }

    return { correctAnswer, message: 'Answer is correct!' };
  } catch (err) {
    throw Error('There was a problem checking this answer.');
  }
}

module.exports = {
  appData,
  allUsers,
  oneUser,
  allQuizzes,
  oneQuiz,
  checkQuizSlug,
  allQuestions,
  oneQuestion,
  checkAnswer,
};
