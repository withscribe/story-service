const swearjar = require('swearjar')
const sentencePerBlock = 3

exports.validate = function(submissionId, content) {
 const blockSet = createBlocks(submissionId, content)
 console.log(blockSet)
  return "hello"
};

/**
 * Loop through blocks -> Max (total sentences / # sentences per block)
 * Loop through each block and push content to block
 * Verify that no blocks have empty content
 */
createBlocks = (submissionId, content) => {
  const sentences = (content).split('.')
  let blockCollection = {} //this holds all the blocks and their status
  blockCollection.approved = false
  blockCollection.submissionId = submissionId
  blockCollection.blocks = []
  for(let totalBlocks = 0; totalBlocks < Math.ceil(sentences.length/sentencePerBlock); totalBlocks++) {
    let block = {} //create new block
    block.currentBlockIndex = totalBlocks //gives block an index of total blocks created
    block.content = []
    block.flags = []
    for(let sentence = 0; sentence < sentencePerBlock; sentence++) {
      const currentLine = ((totalBlocks * sentencePerBlock) + sentence)      
      if(sentences[currentLine] == null || sentences[currentLine] == undefined || sentences[currentLine] == "") {
        break
      } else {      
        block.content.push(sentences[currentLine])
      }
    }
    flagBadBlocks(block)
    blockCollection.blocks.push(block)
  }
  return blockCollection
}

flagBadBlocks = (block) => {
  for(var i = 0; i < block.content.length; i++) { 
    var flaggedContent = swearjar.scorecard(block.content[i]);
    var wordFlags = {}
    for (var badContentType in flaggedContent) {
      wordFlags.word = block.content[i];
      if (flaggedContent.hasOwnProperty(badContentType)) {
          wordFlags.type = badContentType;             
          block.flags.push({ "type": wordFlags.type, "sentenceIndex": i})                
      }     
    }
  }
}
