const mongoose = require('mongoose')

const { Schema, model } = mongoose

/**
 * `电视剧简略信息`
 */
const BriefSchema = new Schema({
  id: String, // todo Number ?
  rate: String,
  cover_x: Number,
  title: String,
  url: String,
  playable: Boolean,
  cover: String,
  cover_y: Number,
  is_new: Boolean,
  driven: { // 是否爬虫到movie表中
    type: Number,
    default: 1
  }
})

module.exports = model('tvBrief', BriefSchema)
