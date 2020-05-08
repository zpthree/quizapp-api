const slugify = require('slugify');

async function createQuiz(_, args, ctx) {
  // TODO add error handling
  // TODO add featured image, attempts, tags, tags
  // TODO don't allow featured images w/ explicit content

  // TODO get logged in user and add to quiz
  const tempUser = '5ea362bd1d414ceff6dc7c3a';

  const slug = slugify(args.title, {
    remove: undefined,
    lower: true,
  });

  // check if slug exists
  const [slugExists] = await ctx.models.Quiz.find({ slug });

  if (slugExists) {
    throw Error('Slug alread exists.');
  }

  const quiz = await new ctx.models.Quiz({
    ...args,
    user: tempUser,
    slug,
  });

  return quiz.save();
}

async function takeQuiz(_, args, ctx) {
  if (!args.id) {
    throw Error('Unable to start the quiz.');
  }

  const quiz = await ctx.models.Quiz.findById(args.id)
    .populate('user')
    .populate('questions');

  // TODO remove cookies for old quiz

  ctx.res.cookie('activeQuiz', quiz.slug, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: 'Lax',
  });

  return quiz;
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

module.exports = { createQuiz, takeQuiz, updateQuiz, deleteQuiz };
