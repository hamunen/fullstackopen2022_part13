const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')

const { User, Blog, ReadingList } = require('../models')

const userBlogFinder = async (req, res, next) => {
  if (!req.body.blogId) return res.status(400).json({ error: 'blogId missing' })
  if (!req.body.userId) return res.status(400).json({ error: 'userId missing' })

  const blog = await Blog.findByPk(req.body.blogId)
  const user = await User.findByPk(req.body.userId)
  if (!blog) return res.status(400).json({ error: 'Blog not found' })
  if (!user) return res.status(400).json({ error: 'User not found' })

  req.blog = blog
  req.user = user

  next()
}

router.post('/', userBlogFinder, async (req, res) => {
  const readingListEntry = await ReadingList.create({
    blogId: req.blog.id,
    userId: req.user.id,
  })

  return res.json(readingListEntry)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)

  const readingListEntry = await ReadingList.findByPk(req.params.id)
  if (!readingListEntry) return res.status(404).end()

  console.log(req.body)
  if (user.id !== readingListEntry.userId)
    return res.status(403).json({ error: 'Not your reading list, dude' })

  if (!req.body.hasOwnProperty('read'))
    return res.status(400).json({ error: 'read status missing from body' })

  readingListEntry.read = req.body.read
  await readingListEntry.save()

  return res.json(readingListEntry)
})

const errorHandler = (error, req, res, next) => {
  console.error(error.name, error.message)

  return res.status(400).json({ error: error.message })
}

router.use(errorHandler)

module.exports = router
