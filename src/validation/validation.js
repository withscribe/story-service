const swearjar = require('swearjar')
const sentencePerBlock = 3
let blocks = []

exports.validate = function(submissionId, content) {
  createBlocks(submissionId, content)
  return "hello"
};

createBlocks = (submissionId, content) => {
  var sentences = (content).split('.')
  for(let i = 0; i < Math.ceil(sentences.length/sentencePerBlock); i++) {
    let block = {}
    block.submissionID = submissionId
    block.blockNumber = i
    // for(let x = 0; x < sentencePerBlock; x++) {
    //   block.content.push(sentences[(i * sentencePerBlock) + x])
    // }
    blocks.push(block)
    console.log(blocks);
  }
}
