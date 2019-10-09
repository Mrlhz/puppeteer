/**
 * `豆瓣电影`
 * `https://movie.douban.com/top250` Top250
 * `https://movie.douban.com/`
 */

const mongoose = require('mongoose')

const { Schema, model } = mongoose

const movieSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  original_title: String,
  rating: {
    type: {
      average: Number,
      max: Number,
      min: Number,
      stars: String
    }
  },
  casts: {
    type: [{
      name: String,
      avatars: {
        large: String
      }
    }]
  },
  comments_count: Number,
  countries: { // 地区
    type: [{
      type: String
    }]
  },
  directors: {
    type: [{
      name: String,
      avatars: {
        large: String
      }
    }]
  }, // 导演
  genres: {
    type: [{
      type: String
    }]
  }, // 类型
  images: {
    type: {
      large: String
    }
  },
  reviews_count: Number,
  summary: {
    type: String,
    default: ''
  },
  wish_count: Number,
  year: Number
})


module.exports = model('Movie', movieSchema)
