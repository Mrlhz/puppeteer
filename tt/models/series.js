/**
 * `AVMOO`
 * `https://avmask.com/cn`
 * `https://avmask.com/cn/series/b2dbb48e19b2bed0/page/1`
 */

const mongoose = require('mongoose')

const { Schema, model } = mongoose

const seriesSchema = new Schema({
  av: String,
  title: String,
  date: String,
  url: String,
  series: {
    type: String,
    default: ''
  },
  driven: {
    type: Number,
    default: 1
  },
  updated: {
    type: Date,
    default: Date.now() + 8 * 60 * 60 * 1000
  }
}, { versionKey: false })


module.exports = {
  seriesSchema: model('series', seriesSchema)
}