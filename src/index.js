const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
const Query = require('./resolvers/Query');

const resolvers = {
  Query,
};

// const resolvers = {
//   Query: {
//     feed(parent, args, ctx, info) {
//       return ctx.db.query.links({ where: { isPublished: true } }, info);
//     },
//   },
//   Mutation: {
//     createDraft(parent, { title, text }, ctx, info) {
//       return ctx.db.mutation.createLink(
//         {
//           data: {
//             title,
//             text,
//             isPublished: false,
//           },
//         },
//         info
//       );
//     },
//     deleteLink(parent, { id }, ctx, info) {
//       return ctx.db.mutation.deleteLink({ where: { id } }, info);
//     },
//     publish(parent, { id }, ctx, info) {
//       return ctx.db.mutation.updateLink(
//         {
//           where: { id },
//           data: { isPublished: true },
//         },
//         info
//       );
//     },
//   },
// };

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://eu1.prisma.sh/public-rosepuma-1/hackernews-prisma/dev', // the endpoint of the Prisma DB service
      secret: 'mysecret123', // specified in database/prisma.yml
      debug: true, // log all GraphQL queryies & mutations
    }),
  }),
});

server.start(() => console.log('Server is running on http://localhost:4000'));
