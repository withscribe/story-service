const { verifyToken } = require('../utils')
const Validation = require('../validation/validation');

async function submitStory (_, args, context, info) {
    const payload = verifyToken(context)
    return await context.prisma.createStory({
        title: args.title,
        author: args.author,
        description: args.description, 
        content: args.content,
        authorId: args.authorId,
        isCloned: false,
        isForked: false    
    })
}

async function updateStory(_, args, context, info) {
    const payload = verifyToken(context);
    return await context.prisma.updateStory({
        where: {
            id: args.id
        },
        data: {
            title: args.title,
            description: args.description,
            content: args.content
        }
    })
}

async function deleteStory(_, args, context, info) {
    const payload = verifyToken(context);
    return await context.prisma.deleteStory({ id: args.id })
}

async function cloneStory (_, args, context, info) {
    const payload = verifyToken(context)
    const parentStory = await context.prisma.story({ id: args.parentStoryId })

    return await context.prisma.createStory({
        parentStoryId: parentStory.id,
        isCloned: true,
        author: parentStory.author,
        authorId: parentStory.authorId,
        nonAuthorId: args.nonAuthorId,
        title: parentStory.title,
        description: parentStory.description,
        content: parentStory.content,
    })
}

async function addLikeToStory(_, args, context, info) {
    const payload = verifyToken(context)
    const story = await context.prisma.story({ id: args.storyId })
    const like = await context.prisma.createLikes({ guid: args.storyId + args.profileId })

    return await context.prisma.updateStory({
        where: {
            id: story.id
        },
        data: {
            likes: story.likes + 1,
            usersWhoLiked: { connect: { id: like.id } }
        }
    })
}


async function removeLikeFromStory(_, args, context, info) {
    const payload = verifyToken(context)
    const story = await context.prisma.story({ id: args.storyId })

    if(story.likes > 0) {
        return await context.prisma.updateStory({
            where: {
                id: story.id
            },
            data: {
                likes: story.likes - 1,
            }
        })
    }
    return story
}

async function forkStory(_, args, context, info) {
    const payload = verifyToken(context)
    const parentStory = await context.prisma.story({ id: args.parentStoryId })

    return await context.prisma.createStory({
        parentStoryId: parentStory.id,
        isForked: true,
        contributionPending: true,
        author: parentStory.author,
        authorId: parentStory.authorId,
        nonAuthorId: args.nonAuthorId,
        title: parentStory.title,
        description: parentStory.description,
        content: parentStory.content,
    })
}

async function contributeRequest(_, args, context, info) {
    const payload = verifyToken(context)

    // get the forked story to retrieve parentStoryId, content etc..
    const forkedStory = await context.prisma.story({ id: args.storyId })

    const originalStory = await context.prisma.story({ id: forkedStory.parentStoryId })

    await context.prisma.updateStory({
        where: {
            id: args.storyId
        },
        data: {
            contributionPending: true,
            content: args.content,
        }
    })

    return await context.prisma.createContribution({
        forkId: forkedStory.id,
        contributorName: args.contributorName,
        contributorProfileId: forkedStory.nonAuthorId,
        authorProfileId: originalStory.authorId,
        originalContent: originalStory.content,
        contributionContent: forkedStory.content,
        comment: args.comment
    })
}

async function approveChanges(_, args, context, info) {
    const payload = verifyToken(context)
    const contribution = await context.prisma.contribution({ id: args.contributionId })

    const forkedStory = await context.prisma.story({ id: contribution.forkId })

    const updatedStory = await context.prisma.updateStory({
        where: {
            id: forkedStory.parentStoryId
        },
        data: {
            content: contribution.contributionContent,
        }
    })

    // delete forked story
    await context.prisma.deleteStory({ id: forkedStory.id })
    
    // delete the contribution
    await context.prisma.deleteContribution({ id: contribution.id })

    return updatedStory
}

async function rejectChanges(_, args, context, info) {
    const payload = verifyToken(context)
    return await context.prisma.deleteContribution({ id: args.contributionId })
}

module.exports = {
    submitStory,
    updateStory,
    deleteStory,
    cloneStory,
    addLikeToStory,
    removeLikeFromStory,
    forkStory,
    contributeRequest,
    approveChanges,
    rejectChanges
}