const revisionFragment = `
  fragment revisionFragment on Revision {
    id
    title
    description
    content
  }
`

module.exports = { revisionFragment };
