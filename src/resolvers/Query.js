const feed = (parent, args, context, info) => {
  const { filter, first, skip } = args;
  // create `where` object to filter by url or description
  const where = filter
    ? { OR: [{ url_contains: filter }, { description_contains: filter }] }
    : {};
  return context.db.query.links({ first, skip, where }, info);
};

const me = (parent, args, context, info) => {
  return context.db.query.users({ where: { githubId: '9408641' } }, info);
};

module.exports = { feed, me };
