const mongoose = require('mongoose')

const { Schema, model } = mongoose

// 豆瓣图书标签
const bookTagsSchema = new Schema({
  tag: String,// 小说(6027382)
  value: Number,
  type: String, // 文学
  T: { // 综合排序
    type: Number, // 按照综合排序爬取 是否(0,1)爬虫到数据库表中
    default: 1
  },
  R: { // 按出版日期排序
    type: Number,
    default: 1
  },
  S: { // 按评价排序
    type: Number,
    default: 1
  }
}) // 版本锁VersionKey { versionKey: false }

module.exports = model('bookTags', bookTagsSchema)