const { verifyToken } = require('../utils')
const Validation = require('../validation/validation');
const { storyFragment } = require("../fragments/StoryFragment");
const { contributionFragment } = require("../fragments/contributionFragment");
const { likesFragment } = require("../fragments/likesFragment");

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
    }).$fragment(storyFragment)
}

async function updateStory(_, args, context, info) {
    const payload = verifyToken(context);

    const story = await context.prisma.story({id: args.id});

    console.log("Story", story);

    return await context.prisma.updateStory({
        where: {
            id: args.id
        },
        data: {
            title: args.title,
            description: args.description,
            content: args.content,
            revisions: {
                create : {
                    title: story.title,
                    description: story.description,
                    content: story.content
                }
            }
        }
    }).$fragment(storyFragment)
}

async function revertStory(_, args, context, info) {
    const payload = verifyToken(context);

    const story = await context.prisma.story({id: args.storyId});
    const revision = await context.prisma.revision({id: args.revisionId});

    return await context.prisma.updateStory({
        where: {
            id: args.storyId
        },
        data: {
            title: revision.title,
            description: revision.description,
            content: revision.content,
            revisions: {
                create: {
                    title: story.title,
                    description: story.description,
                    content: story.content
                }
            }
        }
    }).$fragment(storyFragment)
}

async function deleteStory(_, args, context, info) {
    const payload = verifyToken(context);
    return await context.prisma.deleteStory({ id: args.id }).$fragment(storyFragment)
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
    }).$fragment(storyFragment)
}

async function addLikeToStory(_, args, context, info) {
    const payload = verifyToken(context)
    const story = await context.prisma.story({ id: args.storyId })
    const like = await context.prisma.createLikes({
        guid: args.storyId + args.profileId
    }).$fragment(likesFragment)

    return await context.prisma.updateStory({
        where: {
            id: story.id
        },
        data: {
            likes: story.likes + 1,
            usersWhoLiked: { connect: { id: like.id } }
        }
    }).$fragment(storyFragment)
}


async function removeLikeFromStory(_, args, context, info) {
    const payload = verifyToken(context)
    const story = await context.prisma.story({ id: args.storyId }).$fragment(storyFragment)

    const guid = args.storyId + args.profileId
    const likeToRemove = await context.prisma.likes({ guid: guid }).$fragment(likesFragment)

    if(story.likes > 0) {
        return await context.prisma.updateStory({
            where: {
                id: story.id
            },
            data: {
                likes: story.likes - 1,
                usersWhoLiked: { delete: { id: likeToRemove.id } }
            }
        }).$fragment(storyFragment)
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
    }).$fragment(storyFragment)
}

async function contributeRequest(_, args, context, info) {
    const payload = verifyToken(context)

    // get the forked story to retrieve parentStoryId, content etc..
    const forkedStory = await context.prisma.story({ id: args.storyId }).$fragment(storyFragment)


    const originalStory = await context.prisma.story({ id: forkedStory.parentStoryId }).$fragment(storyFragment)

    await context.prisma.updateStory({
        where: {
            id: forkedStory.id
        },
        data: {
            contributionPending: true,
            content: args.content,
        }
    })

    return await context.prisma.createContribution({
        forkId: forkedStory.id,
        contributorName: args.contributorName,
        originalStoryId: originalStory.id,
        contributorProfileId: forkedStory.nonAuthorId,
        authorProfileId: originalStory.authorId,
        originalContent: originalStory.content,
        contributionContent: args.content,
        comment: args.comment
    }).$fragment(contributionFragment)
}

async function approveChanges(_, args, context, info) {
    const payload = verifyToken(context)
    const contribution = await context.prisma.contribution({ id: args.contributionId })

    const forkedStory = await context.prisma.story({ id: contribution.forkId })
    const originalStory = await context.prisma.story({ id: contribution.originalStoryId })

    const updatedStory = await context.prisma.updateStory({
        where: {
            id: forkedStory.parentStoryId
        },
        data: {
            content: contribution.contributionContent,
            revisions: {
                create: {
                    title: originalStory.title,
                    description: originalStory.description,
                    content: originalStory.content
                }
            }
        }
    }).$fragment(storyFragment)

    // delete forked story
    await context.prisma.deleteStory({ id: forkedStory.id })

    // delete the contribution
    await context.prisma.deleteContribution({ id: contribution.id })

    return updatedStory
}

async function rejectChanges(_, args, context, info) {
    const payload = verifyToken(context)
    const contribution = await context.prisma.contribution({ id: args.contributionId }).$fragment(contributionFragment)
    await context.prisma.deleteStory({ id: contribution.forkId })
    const originalStory = await context.prisma.story({ id: contribution.originalStoryId }).$fragment(storyFragment)
    await context.prisma.deleteContribution({ id: args.contributionId })
    return originalStory
}

module.exports = {
    submitStory,
    updateStory,
    revertStory,
    deleteStory,
    cloneStory,
    addLikeToStory,
    removeLikeFromStory,
    forkStory,
    contributeRequest,
    approveChanges,
    rejectChanges
}
