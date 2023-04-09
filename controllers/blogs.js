const router = require('express').Router()
const { SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')

const { Blog, User } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
  })
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

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({ ...req.body, userId: user.id })
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

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)

  if (!req.blog) return res.status(404).end()
  if (req.blog.userId !== user.id)
    return res
      .status(403)
      .json({ error: "Hey, you can't delete someone else's blog :(" })

  await req.blog.destroy()

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
