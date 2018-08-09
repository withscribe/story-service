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
    storyById: (_, args, context, info) => {
      return context.prisma.query.story(
        {
          where: {
            id: args.storyID
          }
        }
      )
    },
    storiesByProfileId: (_, args, context, info) => {
      return context.prisma.query.stories(
        {
          where: {
            OR: [
              {profileId: args.profileId}
            ]
          }
        }
      )
    }
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

      // console.log(Validation.validate(submissionID, args.content));
      // console.log(submissionID)

      return context.prisma.mutation.createStory(
        {
          data: {
            title: args.title,
            description: args.description, 
            content: args.content,
            profileId: args.profileId             
          },
        },
        info,
      )
    },

  },

}


var text = `In a fuck sense we’ve fuck come to our nation’s capital to cash a check. When the architects of our republic wrote the magnificent words of the Constitution and the Declaration of Independence 
they were signing a promissory note to which every American was to fall heir. This note was a promise that all men, yes, black men as well as white men, would be guaranteed the unalienable rights 
of life, liberty, and the pursuit of happiness. It is obvious today that America has defaulted on this promissory note insofar as her citizens of color are concerned. Instead of honoring this 
sacred obligation, America has given the Negro people a bad check, a check which has come back marked insufficient funds. But we refuse to believe that the bank of justice is bankrupt. We 
refuse to believe that there are insufficient funds in the great vaults of opportunity of this nation. And so we’ve come to cash this check, a check that will give us upon demand the riches 
of freedom and the security of justice. We have also come to this hallowed spot to remind America of the fierce urgency of now. This is no time to engage in the luxury of cooling off or to take 
the tranquilizing drug of gradualism. Now is the time to make real the promises of democracy. Now is the time to rise from the dark and desolate valley of segregation to the sunlit path of racial 
justice. Now is the time to lift our nation from the quicksands of racial injustice to the solid rock of brotherhood. Now is the time to make justice a reality for all of God’s children. It 
would be fatal for the nation to overlook the urgency of the moment. This sweltering summer of the Negro’s legitimate discontent will not pass until there is an invigorating autumn of freedom 
and equality. 1963 is not an end, but a beginning. And those who hope that the Negro needed to blow off steam and will now be content will have a rude awakening if the nation returns to business 
as usual. There will be neither rest nor tranquility in America until the Negro is granted his citizenship rights. The whirlwinds of revolt will continue to shake the foundations of our nation 
until the bright day of justice emerges. But there is something that I must say to my people, who stand on the warm threshold which leads into the palace of justice: in the process of gaining our 
rightful place, we must not be guilty of wrongful deeds. Let us not seek to satisfy our thirst for freedom by drinking from the cup of bitterness and hatred. We must forever conduct our struggle 
on the high plane of dignity and discipline. We must not allow our creative protest to degenerate into physical violence. (My Lord) Again and again, we must rise to the majestic heights of meeting
 physical force with soul force. The marvelous new militancy which has engulfed the Negro community must not lead us to a distrust of all white people, for many of our white brothers, as 
 evidenced by their presence here today, have come to realize that their destiny is tied up with our destiny, and they have come to realize that their freedom is inextricably bound to our freedom. 
 We cannot walk alone.`


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

const options = {
  port: 4000,
  endpoint: '/story',
  subscriptions: '/sub/story',
  playground: '/story/playground'
}


server.start(options, ({ port }) => {
  console.log(`GraphQL server is running on http://localhost:4000`)
  var x = Validation.validate("ds98dsa90sda8dassad", text);
  console.log(x);
})
