// Author: Austin Howlett, Gerhard Knelsen
// Description: Server code, responsible for starting the GraphQLServer and setting the pathing and port

const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')
const ora = require('ora')
require('dotenv').config()

const Query = require('./resolvers/query');
const Mutation = require('./resolvers/mutation');

const resolvers = {
  Query,
  Mutation,
}

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    prisma
  }),
})

const options = {
  port: process.env.PORT || 42189,
  endpoint: '/story',
  subscriptions: '/sub/story',
  playground: '/story/playground'
}

server.start(options, ({ port }) => {
  const spinner = ora().start()
  setTimeout(function() {
      console.log(`Story service has started! Open on port: ${port}`)
      spinner.stop()
  }, 1000);
});
