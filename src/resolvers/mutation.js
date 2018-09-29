const { verifyToken } = require('../utils')
const Validation = require('../validation/validation');

async function submitStory (_, args, context, info) {

    const payload = verifyToken(context)
    const profile = await context.prisma.query.profile(
        {
            where: {
                accountId: payload.accountId
            },
            context,
            info
        }
    )

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
            description: args.description, 
            content: args.content,
            profileId: profile.id,
            submission: submissionID['id'],           
            }, 
        },
        info,
    )
}

async function cloneStory (_, args, context, info) {
    const payload = verifyToken(context)

    const profile = await context.prisma.query.profile(
        {
            where: {
                accountId: payload.accountId
            },
            context,
            info
        }
    )

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
                profileId: profile.id,
                title: parentStory.title,
                description: parentStory.description,
                content: parentStory.content,
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

module.exports = {
    submitStory,
    cloneStory,
    updateStory
}