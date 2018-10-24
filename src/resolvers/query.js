const { verifyToken } = require('../utils')

async function allStories (_, args, context, info) {
    const payload = verifyToken(context)
    return await context.prisma.query.stories(  
        _, 
        info,
    )
}  

function stories (_, args, context, info) {
    const payload = verifyToken(context)
    return context.prisma.query.stories(
        {
            where: {
                OR: [               
                    {title: args.searchString},
                    {description: args.searchString},               
                ]
            },
        },
        info,
    )
}  

async function storyById (_, args, context, info) {
    const payload = verifyToken(context)
    return await context.prisma.query.story(
        {
            where: {
                id: args.storyID,
            }, 
        },
        ` { id, parentStoryId, profileId, author, title, content, description, likes, isCloned } `
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

function getContributionsById(_, args, context, info) {
    return context.prisma.query.contributions(
        {
            where: {
                authorProfile: args.authorProfileId
            }
        }
    )
}

module.exports = {
    allStories,
    stories,
    storyById,
    storiesByProfileId,
    searchByKeyword,
    searchByTitle,
    searchByDescription,
    getContributionsById
}