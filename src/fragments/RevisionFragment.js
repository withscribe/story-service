// Author: Austin Howlett, Gerhard Knelsen
// Description: Fragments ensure that, if requested, all of these fields will be returned

const revisionFragment = `
  fragment revisionFragment on Revision {
    id
    title
    description
    content
    createdAt
    updatedAt
  }
`

module.exports = { revisionFragment };
