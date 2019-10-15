const mongoose = require('mongoose')

const { Schema, model } = mongoose

// 豆瓣图书标签
const bookTagsSchema = new Schema({
  tag: String,// 小说(6027382)
  value: Number,
  type: String, // 文学
  T: {
    value: String,
    driven: Boolean
  },
  R: {
    value: String,
    driven: Boolean
  },
  S: {
    value: String,
    driven: Boolean
  },
  driven: { // 是否爬虫到数据库表中
    type: Number,
    default: 1
  }
})

module.exports = model('bookTags', bookTagsSchema)