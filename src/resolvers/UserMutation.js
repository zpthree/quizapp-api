const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkUnique = require('../utils/checkUniqueValues');

async function toggleTheme(_, args, ctx) {
  const { theme } = args;

  ctx.res.cookie('theme', theme, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
    sameSite: 'Lax',
  });

  return { message: `Theme set to ${theme}.` };
}

async function createUser(_, args, ctx) {
  const password = await bcrypt.hash(args.password, 10);

  args.email = args.email.toLowerCase();

  // create new user
  const user = await new ctx.models.User({
    ...args,
    password,
  });

  // * TODO set cookie
  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

  ctx.res.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  return user.save();
}

async function updateUser(_, args, ctx) {
  let user;
  const { email, username } = args;
  // if (!ctx.request.userId) {
  //   throw Error(
  //     'You do not have permission to update this user. Make sure you are signed in.'
  //   );
  // }

  if (!Object.keys(args).length) {
    throw Error("There's nothing to change.");
  }

  await checkUnique(ctx.models.User, [{ email }, { username }]);

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
}

async function updatePassword(_, args, ctx) {
  const user = await ctx.models.User.findOne({ username: args.username });

  // validate passwords
  if (args.password !== args.confirmPassword) {
    throw Error("Passwords don't match");
  }

  const oldPasswordMatches = await bcrypt.compare(
    args.oldPassword,
    user.password
  );

  if (!oldPasswordMatches) {
    throw new Error('Old password is incorrect.');
  }

  // update password
  const password = await bcrypt.hash(args.password, 10);
  let updatedUser;

  try {
    updatedUser = await ctx.models.User.findOneAndUpdate(
      { username: args.username },
      { password },
      { new: true, runValidators: true }
    );
  } catch (err) {
    throw Error('Password could not be updated.');
  }

  return updatedUser;
}

async function deleteUser(_, args, ctx) {
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
}

module.exports = {
  toggleTheme,
  createUser,
  updateUser,
  updatePassword,
  deleteUser,
};
