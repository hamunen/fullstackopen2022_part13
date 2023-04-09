const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        yearValidation(value) {
          if (value < 1991 || value > new Date().getFullYear())
            throw new Error(
              'Year needs to be between 1991 and current year, idiot'
            )
        },
      },
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'blog',
  }
)

module.exports = Blog
