/**
 * `AVMOO`
 * `https://avmask.com/cn`
 */

const mongoose = require('mongoose')

const { Schema, model } = mongoose

const movieSchema = new Schema({
  title: String,
  screencap: String,
  star: [{
    name: String,
    url: String
  }],
  images: [{
    name: String,
    url: String
  }],
  search: String,
  av: String, // 识别码、番号
  release_date: String, // 发行时间
  length: String, // 长度
  director: {  // 导演
    name: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  },
  studio: {  // 制作商
    name: String,
    url: String
  },
  label: { // 发行商
    name: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  },
  series: {
    name: String,
    url: String
  }, // 系列
  genre: [String], // 类别
  like: {
    type: Boolean,
    default: false
  },
  download: {
    type: Boolean,
    default: false
  },
  is_delete: {
    type: Boolean,
    default: false
  }
})


module.exports = {
  movieSchema: model('movie', movieSchema)
}