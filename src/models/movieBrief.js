const mongoose = require('mongoose')

const { Schema, model } = mongoose

const BriefSchema = new Schema({
  directors: {
    type: [String]
  },
  rate: Number, // 0 暂无评分
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
  },
  valid: { // 条目存在
    type: Boolean,
    default: true
  }
})

module.exports = model('movieBrief', BriefSchema)