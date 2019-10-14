const path = require('path')
const process = require('process')

const { books_mdn_data, movie_dir } = require('../../config/index')
const { writeFile } = require('../../helper/tools')
const movieBrief = require('../../models/movieBrief')
const movie = require('../../models/movie')
const { getMovieDetails } = require('./getMovieDetails')
const { updateOneById, callback } = require('../../mongo/index')

const log = console.log

/**
 * `测试`
 */
const urls = []


// 遍历 电影
// getMovieDetails(urls, {
//   delay: 6000,
// })

// 获取一部或几部电影
// getMovieDetails(['https://movie.douban.com/subject/1297518/'], {
//   delay: 5000
// })

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
  const brief = await movieBrief.find(query, callback).limit(99)
  const urls = brief.map((item) => item.url)
  const list = await getMovieDetails(urls, { delay: 3000 })

  log(brief.length)
  process.exit(0)
}


// index({ id: 1307739 })
// index({ driven: 0 }) // 248

index({ driven: 1, valid: true, rate: { $gt: 9 } })

