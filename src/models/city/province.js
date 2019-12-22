/**
 * http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/index.html
 */

const mongoose = require('mongoose')

const { Schema, model } = mongoose

const provinceSchema = new Schema({
  id: String,
  code: String,
  name: String,
  type: {
    type: String,
    default: 'province'
  },
  level: {
    type: Number,
    default: 1
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

module.exports = model('Province', provinceSchema)
