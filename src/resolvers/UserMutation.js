const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkUnique = require('../utils/checkUniqueValues');

async function toggleTheme(_, args, ctx) {
  const { theme } = args;

  ctx.res.cookie('theme', theme, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
    sameSite: 'none,
  });

  return { message: `Theme set to ${theme}.` };
}

async function createUser(_, args, ctx) {
  const password = await bcrypt.hash(args.password, 10);

  args.email = args.email.toLowerCase();

  const themeColor = {
    hsl: { h: 154.28571428571428, s: 1, l: 0.3156862745098039, a: 1 },
    hex: '#00a15c',
    rgb: { r: 0, g: 161, b: 92, a: 1 },
    hsv: { h: 154.28571428571428, s: 1, v: 0.6313725490196078, a: 1 },
    oldHue: 250,
    source: 'hex',
  };

  // create new user
  const user = await new ctx.models.User({
    ...args,
    password,
    themeColor: JSON.stringify(themeColor),
  });

  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

  ctx.res.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 90,
    sameSite: 'none,
  });

  return user.save();
}

async function signIn(_, args, ctx) {
  const { email, password } = args;
  // check for user with email
  const user = await ctx.models.User.findOne({ email });

  if (!user) {
    throw new Error(`No user found with email ${email}.`);
  }

  // check that password is correct
  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error('Invalid Password.');
  }

  // generate jwt token
  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

  // set cookie with token
  ctx.res.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 90,
    sameSite: 'none,
  });

  return user;
}

function signOut(_, args, ctx) {
  ctx.res.clearCookie('token');
  return { message: 'Goodbye!' };
}

async function updateThemeColor(_, args, ctx) {
  const { color } = args;
  const { userId } = ctx.res.req;

  if (!color) {
    throw Error('You must provide a color to update.');
  }

  if (!userId) {
    throw Error('You must be logged in to do this.');
  }

  const user = await ctx.models.User.findByIdAndUpdate(
    userId,
    { themeColor: color },
    { new: true, runValidators: true }
  );

  return user;
}

async function updateUser(_, args, ctx) {
  let user;
  const { email, username } = args;

  if (!ctx.res.req.userId) {
    throw Error(
      'You do not have permission to update this user. Make sure you are signed in.'
    );
  }

  if (ctx.res.req.userId !== args.id) {
    throw Error('You do not have permission to update this user.');
  }

  if (!Object.keys(args).length) {
    throw Error("There's nothing to change.");
  }

  const sameEmail = await ctx.models.User.find({
    _id: ctx.res.req.userId,
    email,
  });

  if (!sameEmail) {
    await checkUnique(ctx.models.User, [{ email }, { username }]);
  }

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

  if (args.password.length <= 6) {
    throw Error(
      "Password isn't long enough. Must be longer than 6 characters."
    );
  }

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
  signIn,
  signOut,
  updateThemeColor,
  updateUser,
  updatePassword,
  deleteUser,
};
