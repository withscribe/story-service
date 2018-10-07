const { verifyToken } = require('../utils')
const Validation = require('../validation/validation');

async function submitStory (_, args, context, info) {

    const payload = verifyToken(context)

    const submissionID = await context.prisma.mutation.createSubmission({
        data: {
            flag: true
        }
    }, ` { id } `)

    var validationResult = Validation.validate(submissionID['id'], args.content);
    const submissionObject = await context.prisma.mutation.updateSubmission({
        where: {
            id: submissionID['id']  
        },
        data: {
            flag: validationResult.approved          
        }
    })

    return storyDraft = await context.prisma.mutation.createStory({
        data: {
                title: args.title,
                author: args.author,
                description: args.description, 
                content: args.content,
                profileId: args.id,
                submission: submissionID['id'],           
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
                profileId: args.id,
                title: parentStory.title,
                description: parentStory.description,
                content: parentStory.content,
            },
        },
        info,
    )
}

async function likeStory(_, args, context, info) {
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
                usersWhoLiked: { create: { profileId: args.profileId } }
            }
        }
    )

    return storyToBeUpdated
}

module.exports = {
    submitStory,
    updateStory,
    deleteStory,
    cloneStory,
    likeStory
}