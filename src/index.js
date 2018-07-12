const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const resolvers = {
  Query: {
    token: (_, args, context, info) => {
      return context.prisma.query.token(
        {
          where: {
              symbol: args.searchString,
          },
        },
        info,
      )
    },
    tokens: (_, args, context, info) => {
        return context.prisma.query.tokens(
          {
            where: {
                OR:[
                    {symbol_contains: args.searchString},
                    {address_contains: args.searchString},
                    {name_contains: args.searchString},                 
                ]
            },
          },
          info,
        )
      },
  },
  Mutation: {
    createToken: (_, args, context, info) => {
        return context.prisma.mutation.createToken(
            {
              data: {
                symbol: args.symbol,
                address: args.address,
                name: args.name,
                abi: args.abi
              },
            },
            info,
          )
    },
  }
}

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    prisma: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://us1.prisma.sh/chrismfenos/abi-api/dev',
    }),
  }),
})
server.start(() => console.log(`GraphQL server is running on http://localhost:4000`))