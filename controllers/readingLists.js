const router = require('express').Router()

const { User, Blog, ReadingList } = require('../models')

router.post('/', async (req, res) => {
  if (!req.body.blogId) return res.status(400).json({ error: 'blogId missing' })
  if (!req.body.userId) return res.status(400).json({ error: 'userId missing' })

  const blog = await Blog.findByPk(req.body.blogId)
  const user = await User.findByPk(req.body.userId)
  if (!blog) return res.status(400).json({ error: 'Blog not found' })
  if (!user) return res.status(400).json({ error: 'User not found' })

  const readingListEntry = await ReadingList.create({
    blogId: req.body.blogId,
    userId: req.body.userId,
  })

  return res.json(readingListEntry)
})

const errorHandler = (error, req, res, next) => {
  console.error(error.name, error.message)

  return res.status(400).json({ error: error.message })
}

router.use(errorHandler)

module.exports = router
