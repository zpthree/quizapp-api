async function createQuestion(_, args, ctx) {
  // TODO add error handling
  // TODO make sure that there is only one correct answer
  if (!args.quiz) {
    throw Error('Unable to add question. Question not assigned to a quiz.');
  }

  const question = await new ctx.models.Question({
    ...args,
  });

  console.log(args);

  // add new question to user Quiz's question reference
  await ctx.models.Quiz.findByIdAndUpdate(
    args.quiz,
    {
      $push: { questions: question.id },
    },
    { new: true }
  );

  console.log({ questions: question.id });

  return question.save();
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

export default { createQuestion, updateQuestion, deleteQuestion };
