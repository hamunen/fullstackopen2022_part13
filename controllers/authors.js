const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog } = require('../models')
const { sequelize } = require('../util/db')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    group: ['author'],
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
    order: [['likes', 'DESC']],
  })

  console.log(JSON.stringify(authors, null, 2))
  return res.json(authors)
})

const errorHandler = (error, req, res, next) => {
  console.error(error.name, error.message)

  return res.status(400).json({ error: error.message })
}

router.use(errorHandler)

module.exports = router
