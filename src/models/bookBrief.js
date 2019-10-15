const mongoose = require('mongoose')

const { Schema, model } = mongoose

const BriefSchema = new Schema({
  id: Number,
  title: String,
  url: String,
  rating: Number,
  rating_people: {
    type: String,
    default: ''
  },
  publish: String,
  image: String,
  summary: String,
  tag: { // 标签
    type: [String],
    default: []
  },
  driven: { // 是否爬虫到movie表中
    type: Number,
    default: 1
  },
  valid: { // 条目存在
    type: Boolean,
    default: true
  }
})

module.exports = model('bookBrief', BriefSchema)