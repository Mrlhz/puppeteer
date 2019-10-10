const path = require('path')

const { books_mdn_data, movie_dir } = require('../../config/index')
const { writeFile } = require('../../helper/tools')

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

// 豆瓣电影 Top 250
const { subject } = require(path.join(movie_dir, '豆瓣电影 Top 250.json'))
const top250Urls = subject.map((item) => item.url);
// getMovieDetails(top250Urls, {
//   delay: 5000,
//   type: 'Top 250',
//   output: movie_dir
// })

/**
 * `测试`
 */
// getMovieDetails(['https://movie.douban.com/subject/26698264/'], {
//   delay: 6000,
//   type: '页面不存在',
//   output: books_mdn_data // 存放路径
// })

getMovieDetails(['https://movie.douban.com/subject/1307739/'], {
  delay: 0,
  type: '90年代',
  output: movie_dir // 存放路径
})


function test() {
  console.time('time')
  const { subjects } = require(path.join(movie_dir, 'top2501.json'))
  const { s } = require(path.join(movie_dir, 'Top 250-details.json'))
  const res = subjects.map((item, index) => {
    if(item.summary.indexOf('展开全部') !== -1) {
      console.log(index, item.title)
      item = s.find((ele) => ele.id === item.id)
    }

    return item
  })

  const result = {
    type: 'Top 250',
    total: res.length,
    subjects: res
  }
  
  writeFile({
    fileName: 'top250.json',
    data: result,
    output: movie_dir
  })
  console.timeEnd('time')
}

// test()