const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { APP_SECRET } = process.env;

const post = (parent, args, context, info) => {
  const { url, description } = args;
  return context.db.mutation.createLink({ data: { url, description } }, info);
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

module.exports = { post, signup, login };
