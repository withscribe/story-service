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
    createStory: async (_, args, context, info) => {

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
    uploadStory: async (_, args, context, info) => {
      
      const submissionID = await context.prisma.mutation.createSubmission({
        data: {
          flag: true
        }
      }, `{id}`)

      console.log(Validation.validate(submissionID, args.content));
      console.log(submissionID)


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
      endpoint: 'http://localhost:4466',
    }),
  }),
})
server.start(() => console.log(`GraphQL server is running on http://localhost:4000`))