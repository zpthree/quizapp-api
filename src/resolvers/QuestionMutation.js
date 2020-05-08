async function createQuestion(_, args, ctx) {
  // TODO add error handling
  // TODO make sure that there is only one correct answer
  if (!args.quiz) {
    throw Error('Unable to add question. Question not assigned to a quiz.');
  }

  const question = await new ctx.models.Question({
    ...args,
  });

  // add new question to user Quiz's question reference
  await ctx.models.Quiz.findByIdAndUpdate(
    args.quiz,
    {
      $push: { questions: question.id },
    },
    { new: true }
  );

  return question.save();
}

async function answerQuestion(_, args, ctx) {
  if (!args.questionId || !args.answerId) {
    throw Error('Unable to answer question.');
  }

  const question = await ctx.models.Question.findById(args.questionId);

  if (!question) {
    throw Error("Question doesn't exist 🙁.");
  }

  const answerExists = question.answers.filter(
    answer => answer.id === args.answerId
  );

  if (!answerExists) {
    throw Error("Answer doesn't exist 🙁.");
  }

  ctx.res.cookie(args.questionId, args.answerId, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: 'Lax',
  });

  return { message: 'Answered Question.' };
}

async function updateQuestion(_, args, ctx) {
  // TODO add error handling
  // TODO make sure that there is only one correct answer
  const question = await ctx.models.Question.findByIdAndUpdate(
    args.id,
    { ...args },
    { new: true, runValidators: true }
  );

  return question;
}

async function deleteQuestion(_, args, ctx) {
  // TODO add error handling
  const question = await ctx.models.Question.findByIdAndDelete(args.id);

  return { message: `"${question.question}" has been deleted.` };
}

module.exports = {
  createQuestion,
  answerQuestion,
  updateQuestion,
  deleteQuestion,
};
