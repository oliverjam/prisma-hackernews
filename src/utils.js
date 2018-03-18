const jwt = require('jsonwebtoken');

const getUserId = context => {
  // We have access to the actual request via `context`
  const Authorization = context.request.get('Authorization');
  if (!Authorization) {
    throw new Error('Not authenticated');
  }
  const token = Authorization.replace('Bearer ', '');
  // Check the auth header of the request and check the jwt.
  const { userId } = jwt.verify(token, process.env.APP_SECRET);
  // Return the user's ID if they're correctly authenticated.
  return userId;
};

module.exports = { getUserId };
