const router = require('express').Router()

const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    console.log(req.blog.toJSON())
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body)
  return res.json(blog)
})

router.put('/:id', blogFinder, async (req, res) => {
  if (!req.blog) return res.status(404).end()
  if (!req.body.likes || typeof req.body.likes !== 'number')
    throw new Error('Invalid or missing likes, idiot')
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
})

router.delete('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy()
  }
  res.status(204).end()
})

const errorHandler = (error, req, res, next) => {
  console.error(error.name, error.message)

  // if (error.name == 'SequelizeDatabaseError')
  return res.status(400).json({ error: error.message })

  //next(error)
}

router.use(errorHandler)

module.exports = router
