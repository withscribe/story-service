const { verifyToken } = require('../utils')

function allStories (_, args, context, info) {
    //const payload = verifyToken(context)
    return context.prisma.query.stories(  
        _, 
        info,
    )
}  

function stories (_, args, context, info) {
    const payload = verifyToken(context)
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
    const payload = verifyToken(context)
    return context.prisma.query.story(
        {
            where: {
                id: args.storyID
            }
        }
    )
}

function storiesByProfileId (_, args, context, info) {
    const payload = verifyToken(context)
    return context.prisma.query.stories(
        {
            where: {
                profileId: args.profileId
            }
        }
    )
}

function searchByKeyword (_, args, context, info) {
    const payload = verifyToken(context)
    return context.prisma.query.stories(
        {
            where: {
                OR:[               
                    {title_contains: args.searchString},
                    {description_contains: args.searchString},   
                    {content_contains: args.searchString},              
                ]
            }
        }
    )
}

function searchByTitle (_, args, context, info) {
    const payload = verifyToken(context)
    return context.prisma.query.stories(
        {
            where: {
                OR:[               
                    {title_contains: args.searchString},                          
                ]
            }
        }
    )
}

function searchByDescription (_, args, context, info) {
    const payload = verifyToken(context)
    return context.prisma.query.stories(
        {
            where: {
                OR:[               
                    {title_description: args.searchString},                          
                ]
            }
        }
    )
}

// function searchByAuthor - need to query the gateway for the profile service

function allSubmissions (_, args, context, info) {
    const payload = verifyToken(context)
    return context.prisma.query.submissions(  
        _, 
        info,
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
    allStories,
    stories,
    storyById,
    storiesByProfileId,
    getSubmissionsByFlag,
    allSubmissions,
    searchByKeyword,
    searchByTitle,
    searchByDescription
}