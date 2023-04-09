const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')
const { User, ActiveSession } = require('../models')

const validateAndExtractUser = async (req, res, next) => {
  const authorization = req.get('authorization')
  const token = authorization.substring(7)

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(token, SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  const user = await User.findByPk(req.decodedToken.id)
  if (user.disabled) return res.status(403).json({ error: 'user is disabled' })

  const activeSession = await ActiveSession.findOne({
    where: { userId: user.id, token },
  })
  if (!activeSession)
    return res
      .status(401)
      .json({ error: "No active session! Stop hacking or I'll call the cops" })

  req.user = user
  next()
}

module.exports = { validateAndExtractUser }
