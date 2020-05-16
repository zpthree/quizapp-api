const mongoose = require('mongoose');

module.exports = async function appDataQuery(_, args, ctx) {
  const { userId, theme, finalized, activeQuiz } = ctx.res.req;
  const appData = {
    theme,
    finalized,
    activeQuiz,
  };

  if (userId) {
    appData.activeUser = await ctx.models.User.findById(
      userId,
      `firstName lastName username email themeColor`
    );
  }

  // get question keys from cookies and then check that their valid
  const questionKeys = Object.keys(ctx.res.req.questions).filter(question =>
    mongoose.Types.ObjectId.isValid(question)
  );

  const questions = await ctx.models.Question.find()
    .where('_id')
    .in(questionKeys)
    .populate('quiz');

  if (questions && questions[0]) {
    appData.answeredQuestions = [
      ...questions.map(question => ({
        ...question._doc,
        id: question.id,
        answerId: ctx.res.req.questions[question.id],
      })),
    ];
  }

  if (activeQuiz) {
    const quiz = await ctx.models.Quiz.findOne({ slug: activeQuiz });
    appData.activeQuizTitle = quiz.title;
    appData.activeQuizId = quiz.id;

    appData.remainingQuestions = await ctx.models.Question.find({
      quiz: quiz.id,
    })
      .where('_id')
      .nin(questionKeys);
  }

  return appData;
};
