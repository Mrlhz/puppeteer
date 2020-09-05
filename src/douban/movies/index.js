const path = require('path')
const process = require('process')

const { books_mdn_data, movie_dir } = require('../../config/index')
const movieBrief = require('../../models/movieBrief')
const movie = require('../../models/movie')
const { getMovieDetails } = require('./getMovieDetails')
const { callback } = require('../../mongo/index')

const log = console.log

/**
 * `遍历电影`
 */

// 豆瓣电影 Top 250
const { subject } = require(path.join(movie_dir, '豆瓣电影 Top 250.json'))
const top250Urls = subject.map((item) => item.url)
// getMovieDetails(top250Urls, {
//   delay: 5000
// })

/**
 * `测试` 页面不存在
 */
// getMovieDetails(['https://movie.douban.com/subject/26698264/'], {
//   delay: 6000
// })

async function index(query) {
  const brief = await movieBrief.find(query, callback).limit(100)
  const urls = brief.map((item) => item.url)
  const list = await getMovieDetails(urls, { delay: 2000 })

  log(brief.length, urls, list)
  process.exit(0)
}


// index({ id: 1307739 })
// index({ driven: 0 }) // 248

index({ driven: 1, valid: true, rate: { $gte: 8 } })

// bug https://movie.douban.com/subject/5279662/

// todo
// 统一一下打印信息
// 看设计模式
// { T: 0 } 说明已按综合排序爬过  { T:1 } 待爬
// 代理平台
