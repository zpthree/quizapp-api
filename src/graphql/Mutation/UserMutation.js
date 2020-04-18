import bcrypt from 'bcryptjs';
import checkUnique from 'utils/checkUniqueValues';

const createUser = async (_, args, ctx) => {
  const password = await bcrypt.hash(args.password, 10);

  args.email = args.email.toLowerCase();

  // create new user
  const user = await new ctx.models.User({
    ...args,
    password,
  });

  // * TODO set cookie
  // const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

  // ctx.response.cookie('token', token, {
  //   httpOnly: true,
  //   maxAge: 1000 * 60 * 60 * 24 * 365,
  // });

  return user.save();
};

const updateUser = async (_, args, ctx) => {
  let user;
  // if (!ctx.request.userId) {
  //   throw Error(
  //     'You do not have permission to update this user. Make sure you are signed in.'
  //   );
  // }

  console.log(args);

  if (!Object.keys(args).length) {
    throw Error("There's nothing to change.");
  }

  await checkUnique(ctx.models.User, [
    args.email ? ['email', args.email] : [],
    args.username ? ['username', args.username] : [],
  ]);

  try {
    user = await ctx.models.User.findByIdAndUpdate(
      args.id, // ctx.request.userId
      { ...args },
      { new: true, runValidators: true }
    );
  } catch (err) {
    throw Error(
      'Changes to user could not be saved. Make sure you are signed in.'
    );
  }

  if (!user) {
    throw Error('The user you are trying to update could not be found.');
  }

  return user;
};

const deleteUser = async (_, args, ctx) => {
  let user;
  if (!args.id) {
    throw Error('Unable to delete user. No user given.');
  }

  // validate that the user has permission to delete this user otherwise return error

  try {
    // delete the user
    user = await ctx.models.User.findByIdAndDelete(args.id);
  } catch (error) {
    throw Error(`There was an error trying to delete this user.`);
  }

  if (!user) {
    throw Error('The user you are trying to delete could not be found.');
  }

  return { message: `${user.name} has been successfully deleted!` };
};

export default { createUser, updateUser, deleteUser };
