/**
 * `豆瓣电影`
 * `https://movie.douban.com/top250` Top250
 * `https://movie.douban.com/`
 */

const mongoose = require('mongoose')

const { Schema, model } = mongoose

const citySchema = new Schema({
  code: String,
  name: String,
  id: {
    type: String,
    default: ''
  },
  pid: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  },
  level: {
    type: Number,
    default: -1
  },
  url: {
    type: String,
    default: ''
  },
  todo: {
    type: Number,
    default: 1
  }
})


module.exports = model('City', citySchema)