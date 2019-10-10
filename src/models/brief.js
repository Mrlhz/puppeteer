const mongoose = require('mongoose')

const { Schema, model } = mongoose

const BriefSchema = new Schema({
  directors: {
    type: [String]
  },
  rate: String,
  cover_x: Number,
  star: Number,
  title: String,
  url: String,
  casts: [String],
  cover: String,
  id: Number,
  cover_y: Number,
  driven: { // 是否爬虫到movie表中
    type: Number,
    default: 1
  }
})

module.exports = model('Brief', BriefSchema)