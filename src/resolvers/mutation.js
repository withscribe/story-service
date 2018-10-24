const { verifyToken } = require('../utils')
const Validation = require('../validation/validation');

async function submitStory (_, args, context, info) {

    const payload = verifyToken(context)

    return storyDraft = await context.prisma.mutation.createStory({
        data: {
                title: args.title,
                author: args.author,
                description: args.description, 
                content: args.content,
                authorId: args.authorId,        
            }, 
        },
        info,
    )
}

async function updateStory(_, args, context, info) {
    const payload = verifyToken(context);

    const result = await context.prisma.mutation.updateStory(
        {
            where: {
                id: args.id
            },
            data: {
                title: args.title,
                description: args.description,
                content: args.content
            }
        }
    )
    return result
}

async function deleteStory(_, args, context, info) {
    const payload = verifyToken(context);

    const result = await context.prisma.mutation.deleteStory(
        {
            where: {
                id: args.id
            }
        }
    )
    return result
}

async function cloneStory (_, args, context, info) {
    const payload = verifyToken(context)

    const parentStory = await context.prisma.query.story(
        {
            where: {
                id: args.parentStoryId
            }
        }
    );

    return storyClone = await context.prisma.mutation.createStory({
            data: {
                parentStoryId: parentStory.id,
                isCloned: true,
                author: parentStory.author,
                nonAuthorId: args.profileId,
                title: parentStory.title,
                description: parentStory.description,
                content: parentStory.content,
            },
        },
        info,
    )
}

async function addLikeToStory(_, args, context, info) {
    const payload = verifyToken(context)

    const story = await context.prisma.query.story(
        {
            where: {
                id: args.storyId
            }
        }
    )


    const storyToBeUpdated = await context.prisma.mutation.updateStory(
        {
            where: {
                id: story.id
            },
            data: {
                likes: story.likes + 1,
            }
        }
    )

    return storyToBeUpdated
}


async function removeLikeFromStory(_, args, context, info) {
    const payload = verifyToken(context)

    const story = await context.prisma.query.story(
        {
            where: {
                id: args.storyId
            }
        }
    )

    if(story.likes > 0) {
        const storyToBeUpdated = await context.prisma.mutation.updateStory(
            {
                where: {
                    id: story.id
                },
                data: {
                    likes: story.likes - 1,
                }
            }
        )

        return storyToBeUpdated
    }


    return story
}

async function forkStory(_, args, context, info) {
    const payload = verifyToken(context)

    const parentStory = await context.prisma.query.story(
        {
            where: {
                id: args.parentStoryId
            }
        }
    );

    return storyFork = await context.prisma.mutation.createStory({
            data: {
                parentStoryId: parentStory.id,
                isForked: true,
                author: parentStory.author,
                authorId: parentStory.authorId,
                nonAuthorId: args.nonAuthorId,
                title: parentStory.title,
                description: parentStory.description,
                content: parentStory.content,
            },
        },
        info,
    )
}

async function contributeRequest(_, args, context, info) {
    const payload = verifyToken(context)

    // get the forked story to retrieve parentStoryId, content etc..
    const forkedStory = await context.prisma.query.story(
        {
            where: {
                id: args.storyId
            }
        }
    )

    const originalStory = await context.prisma.query.story (
        {
            where: {
                id: forkedStory.parentStoryId
            }
        }
    )

    await context.prisma.mutation.updateStory(
        {
            where: {
                id: args.storyId
            },
            data: {
                contributionPending: true
            }
        }
    )

    return await context.prisma.mutation.createContribution(
        {
            data: {
                forkId: forkedStory.id,
                contributorProfileId: forkedStory.nonAuthorId,
                authorProfileId: originalStory.authorId,
                content: forkedStory.content,
                // comment: args.comment
            },
        },
        info
    )
}

async function approveChanges(_, args, context, info) {
    const payload = verifyToken(context)

    const contribution = await context.prisma.query.contribution(
        {
            where: {
                id: args.contributionId
            }
        }
    )

    console.log(contribution)

    const forkedStory = await context.prisma.query.story(
        {
            where: {
                id: contribution.forkId
            }
        }
    )

    console.log(forkedStory)

    return updatedStory = await context.prisma.mutation.updateStory(
        {
            where: {
                id: forkedStory.parentStoryId
            },
            data: {
                content: contribution.content,
            }
        }
    )

    console.log(updatedStory)

    // delete forked story
    // await context.prisma.mutation.deleteStory(
    //     {
    //         where: {
    //             id: forkedStory.id
    //         }
    //     }
    // )
    
    // // delete the contribution
    // await context.prisma.mutation.deleteContribution(
    //     {
    //         where: {
    //             id: contribution.id
    //         }
    //     }
    // )

    return updatedStory
}

async function rejectChanges(_, args, context, info) {
    const payload = verifyToken(context)

    return await context.prisma.mutation.deleteContribution (
        {
            where: {
                id: args.contributionId
            }
        }
    )
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