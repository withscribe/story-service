const { verifyToken } = require('../utils');
const { storyFragment } = require("../fragments/StoryFragment");
const { contributionFragment } = require("../fragments/contributionFragment");
const { revisionFragment } = require("../fragments/RevisionFragment");

// TODO: Review the permissions for these ... for now full access
allStories = async (_, args, context, info) => {
  return await context.prisma.stories({
    where: {
      isCloned: false,
      isForked: false,
    },
    orderBy: 'id_DESC',
    first: args.first,
    last: args.last,
    before: args.before,
    after: args.after,
    skip: args.skip,
  }).$fragment(storyFragment)
}

stories = (_, args, context, info) => {
  //const payload = verifyToken(context)
  return context.prisma.stories({
    where: {
      OR: [
        { title: args.searchString },
        { description: args.searchString },
      ],
      first: args.first,
      last: args.last,
      before: args.before,
      after: args.after,
      skip: args.skip,
    },
  }).$fragment(storyFragment)
}

storyById = async (_, args, context, info) => {
  //const payload = verifyToken(context)
  return await context.prisma.story({ id: args.storyID }).$fragment(storyFragment)
}

storiesByAuthorId = (_, args, context, info) => {
  //const payload = verifyToken(context)
  return context.prisma.stories({
    where: {
      AND: [
        { authorId: args.authorId },
        { isForked: false },
        { isCloned: false }
      ],
      first: args.first,
      last: args.last,
      before: args.before,
      after: args.after,
      skip: args.skip,
    }
  }).$fragment(storyFragment)
}

storiesByNonAuthorId = (_, args, context, info) => {
  //const payload = verifyToken(context)
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
      ],
      first: args.first,
      last: args.last,
      before: args.before,
      after: args.after,
      skip: args.skip,
    }
  }).$fragment(storyFragment)
}

storiesByCommunityId = (_, args, context, info) => {
  //const payload = verifyToken(context)
  return context.prisma.stories({
    where: {
      communityId: args.communityId,
      first: args.first,
      last: args.last,
      before: args.before,
      after: args.after,
      skip: args.skip,
    }
  }).$fragment(storyFragment)
}

searchByKeyword = (_, args, context, info) => {
  //const payload = verifyToken(context)
  return context.prisma.stories({
    where: {
      OR: [
          { title_contains: args.searchString },
          { description_contains: args.searchString },
          { content_contains: args.searchString },
      ],
      first: args.first,
      last: args.last,
      before: args.before,
      after: args.after,
      skip: args.skip,
    }
  }).$fragment(storyFragment)
}

searchByTitle = (_, args, context, info) => {
  //const payload = verifyToken(context)
  return context.prisma.stories({
    where: {
      OR: [
        { title_contains: args.searchString },
      ],
      first: args.first,
      last: args.last,
      before: args.before,
      after: args.after,
      skip: args.skip,
    }
  }).$fragment(storyFragment)
}

searchByDescription = (_, args, context, info) => {
  //const payload = verifyToken(context)
  return context.prisma.stories({
    where: {
      OR: [
        { title_description: args.searchString },
      ],
      first: args.first,
      last: args.last,
      before: args.before,
      after: args.after,
      skip: args.skip,
    }
  }).$fragment(storyFragment)
}

getContributionsById = (_, args, context, info) => {
  const payload = verifyToken(context)
  return context.prisma.contributions({
    where: {
      authorProfileId: args.authorProfileId,
      first: args.first,
      last: args.last,
      before: args.before,
      after: args.after,
      skip: args.skip,
    }
  }).$fragment(contributionFragment)
}

getContributionById = async (_, args, context, info) => {
    const payload = verifyToken(context)
    return await context.prisma.contribution({ id: args.id })
        .$fragment(contributionFragment)
}

revisionById = async (_, args, context, info) => {
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
