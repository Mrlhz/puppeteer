const mongoose = require('mongoose')

const { Schema, model } = mongoose

const BriefSchema = new Schema({
  id: Number,
  title: String,
  url: String,
  rating: Number,
  publish: String,
  image: String,
  summary: String,
  driven: { // 是否爬虫到movie表中
    type: Number,
    default: 1
  }
})

module.exports = model('bookBrief', BriefSchema)