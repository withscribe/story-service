const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const Query = require('./resolvers/query');
const Mutation = require('./resolvers/mutation');

const resolvers = {
  Query,
  Mutation,
}

const server = new GraphQLServer({
  typeDefs: 'schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    prisma: new Prisma({
      typeDefs: './generated/prisma.graphql',
      endpoint: 'http://localhost:4466',
    }),
  }),
})

const options = {
  port: 4000,
  endpoint: '/story',
  subscriptions: '/sub/story',
  playground: '/story/playground'
}

server.start(options, ({ port }) => {
  console.log(`GraphQL server is running on http://localhost:4000`)
})
