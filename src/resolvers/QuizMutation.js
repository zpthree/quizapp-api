async function createQuiz(_, args, ctx) {
  // TODO add error handling
  // TODO add featured image, attempts, tags, tags
  // TODO don't allow featured images w/ explicit content
  // TODO get logged in user and add to quiz
  const tempUser = '5ea362bd1d414ceff6dc7c3a';

  const quiz = await new ctx.models.Quiz({
    ...args,
    user: tempUser,
  });

  console.log(quiz);

  return quiz.save();
}

async function updateQuiz(_, args, ctx) {
  // TODO add error handling
  const quiz = ctx.models.Quiz.findByIdAndUpdate(
    args.id,
    { ...args },
    { new: true, runValidators: true }
  );

  return quiz;
}

async function deleteQuiz(_, args, ctx) {
  // TODO add error handling
  const quiz = await ctx.models.Quiz.findByIdAndDelete(args.id);

  return { message: `"${quiz.title}" has been deleted.` };
}

export default { createQuiz, updateQuiz, deleteQuiz };
