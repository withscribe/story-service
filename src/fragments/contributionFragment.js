const contributionFragment = `
  fragment contributionFragment on Contribution {
    id
    forkId
    originalStoryId
    contributorName
    contributorProfileId
    authorProfileId
    originalContent
    contributionContent
    comment
    updatedAt
    createdAt
  }
`

module.exports = { contributionFragment };
