const jwt = require('jsonwebtoken')
require('dotenv').config()

function getAccountId(context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const accountId = jwt.verify(token, process.env.TOKEN_SECRET);
    return accountId
  }

  throw new AuthError()
}

class AuthError extends Error {
  constructor() {
    super('Not Authorized')
  }
}

module.exports = {
  getAccountId,
}