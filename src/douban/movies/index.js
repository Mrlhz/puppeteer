
const { books_mdn_data } = require('../../config/index')

const { getMovieDetails } = require('./getMovieDetails')


/**
 * `测试`
 */
const movies = require('D:/books/mdn/data/movie/sort=S&range=6,10&tags=电影&countries=中国大陆&start=[0,1000].json')

const urls = movies.map((item) => item.url)

console.log(urls.length)

// 遍历 电影
// getMovieDetails(urls, {
//   delay: 6000,
//   type: '中国大陆',
//   output: books_mdn_data // 存放路径
// })



// 获取一部或几部电影
// getMovieDetails(['https://movie.douban.com/subject/1297518/'], {
//   delay: 5000,
//   type: '喜剧-古装',
//   name: '输出文件名',
//   output: books_mdn_data // 存放路径，output下应有temp文件夹
// })


/**
 * `测试`
 */
// getMovieDetails(['https://movie.douban.com/subject/26698264/'], {
//   delay: 6000,
//   type: '页面不存在',
//   output: books_mdn_data // 存放路径
// })