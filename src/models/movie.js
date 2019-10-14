/**
 * `豆瓣电影`
 * `https://movie.douban.com/top250` Top250
 * `https://movie.douban.com/`
 */

const mongoose = require('mongoose')

const { Schema, model } = mongoose

const movieSchema = new Schema({
  url: String,
  directors: { // 导演
    type: [{
      type: String
    }]
  },
  screenwriter: {// 编剧
    type: [{
      type: String
    }]
  },
  genres: {// 类型
    type: [{
      type: String
    }]
  },
  countries: { // 制片国家/地区
    type: [{
      type: String
    }]
  },
  language: {
    type: [{
      type: String
    }]
  },
  initial_release_date: { // 上映日期
    type: [{
      type: String
    }]
  },
  runtime: {
    type: String,
    default: ''
  },
  original_title: {
    type: [{
      type: String
    }]
  },
  imdb: {
    type: String,
    default: ''
  },
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  year: Number,
  image: {
    type: String,
    default: ''
  },
  images: {
    type: {
      more: String
    }
  },
  rating_people: Number,
  rating: Number,
  comments_count: Number,
  summary: {
    type: String,
    default: ''
  },
  actors: {// 主演
    type: [{
      name: String,
      url: String
    }]
  },
  episodes: { // 集数
    type: String,
    default: ''
  },
  single_episode_length: { // 单集片长
    type: String,
    default: ''
  },
  top250: {
    type: Number,
    default: 1
  },
  is_delete: {
    type: Boolean,
    default: false
  }
})


module.exports = model('Movie', movieSchema)