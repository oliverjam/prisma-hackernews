const newLink = {
  subscribe: (parent, args, context, info) =>
    context.db.subscription.link({}, info),
};

const newVote = {
  subscribe: (parent, args, context, info) =>
    context.db.subscription.vote({}, info),
};

module.exports = { newLink, newVote };
