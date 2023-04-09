const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')
const ActiveSession = require('./activeSession')

User.hasMany(Blog)
Blog.belongsTo(User)

Blog.belongsToMany(User, { through: ReadingList, as: 'readers' })
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })

User.hasMany(ActiveSession)

module.exports = {
  Blog,
  User,
  ReadingList,
  ActiveSession,
}
