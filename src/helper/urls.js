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


module.exports = {
  formatUrls
}

// let urls = formatUrls('https://book.douban.com/tag/%s?start=%s&type=%s', {
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