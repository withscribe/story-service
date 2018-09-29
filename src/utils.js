const jwt = require('jsonwebtoken')
require('dotenv').config()

function verifyToken(context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    return payload
  }

  throw new AuthError()
}

class AuthError extends Error {
  constructor() {
    super('Not Authorized')
  }
}

module.exports = {
  verifyToken,
}