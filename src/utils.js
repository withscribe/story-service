const jwt = require('jsonwebtoken')
require('dotenv').config()

function getUserId(context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const userId = jwt.verify(token, process.env.TOKEN_SECRET);
    return userId
  }

  throw new Error('User is not authenticated')
}

module.exports = {
  getUserId,
}