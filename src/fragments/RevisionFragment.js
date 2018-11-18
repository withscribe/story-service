const revisionFragment = `
  fragment revisionFragment on Revision {
    id
    title
    description
    content
    createdAt
  }
`

module.exports = { revisionFragment };
