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
