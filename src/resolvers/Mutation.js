const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserId } = require('../utils');
const { getGithubToken, getGithubUser } = require('../github');

const { APP_SECRET } = process.env;

const post = (parent, args, context, info) => {
  const { url, description } = args;
  // Authenticate user via req header and return ID from JWT
  const userId = getUserId(context);
  return context.db.mutation.createLink(
    { data: { url, description, postedBy: { connect: { id: userId } } } },
    info
  );
};

const authenticate = async (parent, args, context, info) => {
  const githubToken = await getGithubToken(args.githubCode);
  const githubUser = await getGithubUser(githubToken);
  const githubId = githubUser.id;

  let user = await context.db.query.user({ where: { githubId } }, info);
  if (!user) {
    user = await context.db.mutation.createUser({
      data: { ...args, githubId: githubUser.id },
      info,
    });
  }
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user,
  };
};

// const signup = async (parent, args, context, info) => {
//   // has the password the user entered
//   const password = await bcrypt.hash(args.password, 10);
//   // pass hashed version of the pw along with the other args to the DB
//   const user = await context.db.mutation.createUser({
//     data: { ...args, password },
//   });
//   // create a JWT to authenticate them for this session
//   const token = jwt.sign({ userId: user.id }, APP_SECRET);
//   return { token, user };
// };

// const login = async (parent, args, context, info) => {
//   const { email, password } = args;
//   // query for a matching user in the DB
//   const user = await context.db.query.user({ where: { email } });
//   if (!user) {
//     throw new Error(`Couldn't find user with email ${email}`);
//   }
//   // compare the hashed DB pw with the one the user entered
//   const valid = await bcrypt.compare(password, user.password);
//   if (!valid) {
//     throw new Error('Password invalid');
//   }
//   // create a JWT to authenticate them for this session
//   const token = jwt.sign({ userId: user.id }, APP_SECRET);
//   return { token, user };
// };

const vote = async (parent, args, context, info) => {
  // Authenticate user via req header and return ID from JWT
  const userId = getUserId(context);
  const { linkId } = args;
  // check if there's a Vote from this User for this Link
  const alreadyVotedFor = await context.db.exists.Vote({
    user: { id: userId },
    link: { id: linkId },
  });
  if (alreadyVotedFor) {
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

module.exports = { post, authenticate, vote };
