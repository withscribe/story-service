const { getAccountId } = require('../utils')
const Validation = require('../validation/validation');

async function submitStory (_, args, context, info) {
    const payload = getAccountId(context)
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
            profileId: args.profileId,
            submission: submissionID['id'],           
            }, 
        },
        info,
    )
}

module.exports = {
    submitStory,
}