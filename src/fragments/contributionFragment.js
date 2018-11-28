// Author: Austin Howlett, Gerhard Knelsen
// Description: Fragments ensure that, if requested, all of these fields will be returned

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
