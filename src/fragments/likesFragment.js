// Author: Austin Howlett, Gerhard Knelsen
// Description: Fragments ensure that, if requested, all of these fields will be returned

const likesFragment = `
    fragment likesFragment on Likes {
        id
        guid
    }
`
module.exports = { likesFragment }