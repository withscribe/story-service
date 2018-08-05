const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

var Validation = require('./validation/validation');

const resolvers = {
  Query: {   
    story: (_, args, context, info) => {
      return context.prisma.query.story(
        {
          where: {
              OR:[
                  {title: args.searchString},
                  {description: args.searchString},                               
              ]
          },
        },
        info,
      )
    },   
  },
  Mutation: {
    createStory: (_, args, context, info) => {
      //console.log(Validation.validate());

      return context.prisma.mutation.createStory(
            {
              data: {
                title: args.title,
                description: args.description,              
              },
            },
            info,
          )
    },
  }, 
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