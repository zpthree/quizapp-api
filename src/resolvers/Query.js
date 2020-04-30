import shuffleArray from 'utils/shuffleArray';

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
  const quiz = await ctx.models.Quiz.findById(args.id)
    .populate('user')
    .populate('questions');

  return quiz;
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

    if (newAnswers.length >= question.answerCount) {
      return false;
    }

    return (newAnswers = [...newAnswers, answer]);
  });

  return {
    ...question._doc,
    id: question.id,
    answers: shuffleArray(newAnswers),
  };
}

async function checkAnswer(_, args, ctx) {
  const question = await ctx.models.Question.findById(args.id);

  if (!question) {
    throw Error('Question not found.');
  }

  try {
    const correctAnswer = question.answers.find(
      answer => answer.correct === true
    );

    if (args.answer !== correctAnswer.id) {
      return { correctAnswer, message: 'Answer is incorrect.' };
    }

    return { correctAnswer, message: 'Answer is correct!' };
  } catch (err) {
    throw Error('There was a problem checking this answer.');
  }
}

export default {
  allUsers,
  oneUser,
  allQuizzes,
  oneQuiz,
  allQuestions,
  oneQuestion,
  checkAnswer,
};
