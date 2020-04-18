const createQuestion = async (_, args, ctx) => {
  // TODO add error handling
  // TODO make sure that there is only one correct answer
  const question = await new ctx.models.Question({
    ...args,
  });

  return question.save();
};

const updateQuestion = async (_, args, ctx) => {
  // TODO add error handling
  // TODO make sure that there is only one correct answer
  const question = await ctx.models.Question.findByIdAndUpdate(
    args.id,
    { ...args },
    { new: true, runValidators: true }
  );

  return question;
};

const deleteQuestion = async (_, args, ctx) => {
  // TODO add error handling
  const question = await ctx.models.Question.findByIdAndDelete(args.id);

  return { message: `"${question.question}" has been deleted.` };
};

export default { createQuestion, updateQuestion, deleteQuestion };
