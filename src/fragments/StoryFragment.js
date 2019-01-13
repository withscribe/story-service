const storyFragment = `
  fragment storyFragment on Story {
    id
    authorId
    nonAuthorId
    parentStoryId
    author
    coAuthors
    isCloned
    isForked
    contributionPending
    title
    description
    content
    share
    views
    likes
    clones
    contributions
    createdAt
    updatedAt
    usersWhoLiked {
      id
      guid
    }
    revisions {
      id
      title
      description
      content
      createdAt
      updatedAt
    }
  }
`

module.exports = { storyFragment };
