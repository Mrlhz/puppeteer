/**
 * `AVMOO`
 * `https://avmask.com/cn`
 * `https://avmask.com/cn/genre`
 * `https://avmask.com/en/genre`
 */

const mongoose = require('mongoose')

const { Schema, model } = mongoose

const genreSchema = new Schema({
  title: String,
  url: String,
  type: String,
  title_en: String,
  url_en: String,
  type_en: String,
  updated: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false })


module.exports = {
  genre: model('genre', genreSchema)
}