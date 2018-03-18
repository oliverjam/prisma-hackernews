const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserId } = require('../utils');

const { APP_SECRET } = process.env;

const post = (parent, args, context, info) => {
  const { url, description } = args;
  const userId = getUserId(context);
  return context.db.mutation.createLink(
    { data: { url, description, postedBy: { connect: { id: userId } } } },
    info
  );
};

const signup = async (parent, args, context, info) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.db.mutation.createUser({
    data: { ...args, password },
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return { token, user };
};

const login = async (parent, args, context, info) => {
  const { email, password } = args;
  const user = await context.db.query.user({ where: { email } });
  if (!user) {
    throw new Error(`Couldn't find user with email ${email}`);
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('Password invalid');
  }
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return { token, user };
};

const vote = async (parent, args, context, info) => {
  const userId = getUserId(context);
  const { linkId } = args;
  const linkExists = await context.db.exists.Vote({
    user: { id: userId },
    link: { id: linkId },
  });
  if (linkExists) {
    throw new Error(`Already voted for link: ${linkId}`);
  }

  return context.db.mutation.createVote(
    {
      data: {
        user: { connect: { id: userId } },
        link: { connect: { id: linkId } },
      },
    },
    info
  );
};

module.exports = { post, signup, login, vote };
