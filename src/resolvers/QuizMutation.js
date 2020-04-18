const createQuiz = async (_, args, ctx) => {
  // TODO add error handling
  // TODO add featured image, attempts, tags, tags
  // TODO don't allow featured images w/ explicit content

  const quiz = await new ctx.models.Quiz({
    ...args,
  });

  return quiz.save();
};

const updateQuiz = async (_, args, ctx) => {
  // TODO add error handling
  const quiz = ctx.models.Quiz.findByIdAndUpdate(
    args.id,
    { ...args },
    { new: true, runValidators: true }
  );

  return quiz;
};

const deleteQuiz = async (_, args, ctx) => {
  // TODO add error handling
  const quiz = await ctx.models.Quiz.findByIdAndDelete(args.id);

  return { message: `"${quiz.title}" has been deleted.` };
};

export default { createQuiz, updateQuiz, deleteQuiz };
