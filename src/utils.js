const jwt = require('jsonwebtoken');

const getUserId = context => {
  const Authorization = context.request.get('Authorization');
  if (!Authorization) {
    throw new Error('Not authenticated');
  }
  const token = Authorization.replace('Bearer ', '');
  const { userId } = jwt.verify(token, process.env.APP_SECRET);
  return userId;
};

module.exports = { getUserId };
