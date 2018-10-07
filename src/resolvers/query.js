const { verifyToken } = require('../utils')

async function allStories (_, args, context, info) {
    const payload = verifyToken(context)
    const stories = await context.prisma.query.stories(  
        _, 
        info,
    )

    console.log(stories)
    return stories
}  

function stories (_, args, context, info) {
    const payload = verifyToken(context)
    const stories =  context.prisma.query.stories(
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
    console.log(stories)
    return stories
}  

async function storyById (_, args, context, info) {
    const payload = verifyToken(context)
    return await context.prisma.query.story(
        {
            where: {
                id: args.storyID,
            }, 
        },
        ` { id, parentStoryId, profileId, author, title, content, description, likes, usersWhoLiked { profileId } } `
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