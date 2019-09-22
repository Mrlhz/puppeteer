const utils = require('util')

/**
 * @description 构造url数组 `https://book.douban.com/tag/[]?start=[]&type=[]`
 * @see https://book.douban.com/tag/编程?start=0&type=T
 *
 * @param {String} url
 * @param {Object} [options={}]
 * @returns {Array} url数组
 */
function formatUrls(url, options = {}) {
  let {
    start = 0, end = 20, increase = 20, tag = '编程', type = 'T'
  } = options
  let urls = []
  for (let i = start; i <= end; i += increase) {
    urls.push(utils.format(url, tag, i, type))
  }
  return urls;
}

/**
 * @description 拼凑影视urls
 * @param {Object} [options={}] 参数列表
 * @returns {Array} urls列表
 */
function makeMovieUrls(options={}) {
  const url = 'https://movie.douban.com/j/search_subjects?type=%s&tag=%s&sort=%s&page_limit=%s&page_start=%s'
  let { type = 'tv', tag = '热门', sort = 'rank', page_limit = 100, page_start = 0, end = 500 } = options
  let urls = []
  for (let i = page_start; i < end; i += page_limit) {
    urls.push(utils.format(url, type, tag, sort, page_limit, i))
  }
  return urls
}

module.exports = {
  formatUrls,
  makeMovieUrls
}

// const urls = formatUrls('https://book.douban.com/tag/%s?start=%s&type=%s', {
//   tag: '编程', // type[综合排序 T  |  按出版日期排序 R |  按评价排序 S]
//   start: 0,
//   end: 980,
//   increase: 20,
//   type: 'S'
// })

// console.log(urls);

// [ 'https://book.douban.com/tag/编程?start=0&type=S',
//   'https://book.douban.com/tag/编程?start=20&type=S',
//   'https://book.douban.com/tag/编程?start=40&type=S',
//   ...
//   'https://book.douban.com/tag/编程?start=960&type=S',
//   'https://book.douban.com/tag/编程?start=980&type=S' ]


// const urls = makeMovieUrls({})
// const urls = makeMovieUrls({tag: '日剧', sort: 'time', page_limit: 200})
// console.log(urls)