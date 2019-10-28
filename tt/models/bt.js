const mongoose = require('mongoose')

const { Schema, model } = mongoose


const btBookSchema = new Schema({
  id: String,
  title: {
    type: String,
    default: ''
  },
  hash: String,
  magnet: {
    type: String,
    default: ''
  },
  type: [String],
  info: {
    type: String,
    default: ''
  },
  stars: [{ // 演员
    name: String,
    url: String
  }],
  images: [String],
  driven: {
    type: Number, // 是否(0,1)爬虫到数据库表中
    default: 1
  }
}, { versionKey: false }) // 版本锁VersionKey { versionKey: false }

module.exports = model('btbook', btBookSchema)