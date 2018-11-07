const { verifyToken } = require('../utils')

async function allStories (_, args, context, info) {
    const payload = verifyToken(context)
    return await context.prisma.stories(_)
}

function stories (_, args, context, info) {
    const payload = verifyToken(context)
    return context.prisma.stories({
        where: {
            OR: [
                { title: args.searchString },
                { description: args.searchString },
            ]
        },
    })
}

async function storyById (_, args, context, info) {
    const payload = verifyToken(context)
    return await context.prisma.story({ id: args.storyID })
}

function storiesByAuthorId (_, args, context, info) {
    const payload = verifyToken(context)
    return context.prisma.stories({
        where: {
            AND: [
                { authorId: args.authorId },
                { isForked: false },
                { isCloned: false }
            ]
        }
    })
}

function storiesByNonAuthorId (_, args, context, info) {
    const payload = verifyToken(context)
    return context.prisma.stories({
        where: {
            AND: [
                { nonAuthorId: args.nonAuthorId },
                {
                    OR: [
                        { isForked: true },
                        { isCloned: true }
                    ]
                }
            ]
        }
    })
}

function searchByKeyword (_, args, context, info) {
    const payload = verifyToken(context)
    return context.prisma.stories({
        where: {
            OR: [
                { title_contains: args.searchString },
                { description_contains: args.searchString },
                { content_contains: args.searchString },
            ]
        }
    })
}

function searchByTitle (_, args, context, info) {
    const payload = verifyToken(context)
    return context.prisma.stories({
        where: {
            OR: [ { title_contains: args.searchString }, ]
        }
    })
}

function searchByDescription (_, args, context, info) {
    const payload = verifyToken(context)
    return context.prisma.stories({
        where: {
            OR: [ { title_description: args.searchString }, ]
        }
    })
}

function getContributionsById(_, args, context, info) {
    const payload = verifyToken(context)
    return context.prisma.contributions({
        where: {
            authorProfileId: args.authorProfileId
        }
    })
}

async function getContributionById(_, args, context, info) {
    const payload = verifyToken(context)
    return await context.prisma.contribution({ id: args.id })
}

module.exports = {
    allStories,
    stories,
    storyById,
    storiesByAuthorId,
    storiesByNonAuthorId,
    searchByKeyword,
    searchByTitle,
    searchByDescription,
    getContributionsById,
    getContributionById
}
