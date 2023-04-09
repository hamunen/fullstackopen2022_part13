const router = require('express').Router()

const { ActiveSession } = require('../models')
const { validateAndExtractUser } = require('../util/middleware')

router.delete('/', validateAndExtractUser, async (req, res) => {
  ActiveSession.destroy({ where: { userId: req.user.id } })

  res.status(200).end()
})

module.exports = router
