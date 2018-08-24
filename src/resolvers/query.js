const { getUserId } = require('../utils')


function stories (_, args, context, info) {
    // const userId = getUserId(context);
    return context.prisma.query.stories(
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
}  

function storyById (_, args, context, info) {
    // const userId = getUserId(context);
    return context.prisma.query.story(
        {
            where: {
            id: args.storyID
            }
        }
    )
}

function storiesByProfileId (_, args, context, info) {
    // const userId = getUserId(context);
    return context.prisma.query.stories(
    {
        where: {
            profileId: args.profileId
        }
    }
    )
}

function getSubmissionsByFlag (_, args, context, info) {     
    return context.prisma.query.submissions(
        {
            where: {            
            flag: args.flag            
            }
        }
    )
}

module.exports = {
    stories,
    storyById,
    storiesByProfileId,
    getSubmissionsByFlag
}