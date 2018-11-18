const { verifyToken } = require('../utils');
const { storyFragment } = require("../fragments/StoryFragment");
const { contributionFragment } = require("../fragments/contributionFragment");
const { revisionFragment } = require("../fragments/RevisionFragment");

async function allStories (_, args, context, info) {
    const payload = verifyToken(context)
    return await context.prisma.stories(_).$fragment(storyFragment)
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
    }).$fragment(storyFragment)
}

async function storyById (_, args, context, info) {
    const payload = verifyToken(context)
    return await context.prisma.story({ id: args.storyID }).$fragment(storyFragment)
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
    }).$fragment(storyFragment)
}

function storiesByNonAuthorId(_, args, context, info) {
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
    }).$fragment(storyFragment)
}

function storiesByCommunityId(_, args, context, info) {
    const payload = verifyToken(context)
    return context.prisma.stories({
        where: {
            communityId: args.communityId
        }
    }).$fragment(storyFragment)
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
    }).$fragment(storyFragment)
}

function searchByTitle (_, args, context, info) {
    const payload = verifyToken(context)
    return context.prisma.stories({
        where: {
            OR: [ { title_contains: args.searchString }, ]
        }
    }).$fragment(storyFragment)
}

function searchByDescription (_, args, context, info) {
    const payload = verifyToken(context)
    return context.prisma.stories({
        where: {
            OR: [ { title_description: args.searchString }, ]
        }
    }).$fragment(storyFragment)
}

function getContributionsById(_, args, context, info) {
    const payload = verifyToken(context)
    return context.prisma.contributions({
        where: {
            authorProfileId: args.authorProfileId
        }
    }).$fragment(contributionFragment)
}

async function getContributionById(_, args, context, info) {
    const payload = verifyToken(context)
    return await context.prisma.contribution({ id: args.id })
        .$fragment(contributionFragment)
}

async function revisionById (_, args, context, info) {
    const payload = verifyToken(context)
    return await context.prisma.revision({ id: args.id }).$fragment(revisionFragment)
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
    getContributionById,
    storiesByCommunityId,
    revisionById
}
