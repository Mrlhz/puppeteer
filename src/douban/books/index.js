
const { books_mdn_data } = require('../../config/index')

const { getBookDetails } = require('./getBookDetails')


/**
 * `测试`
 */
const { name, subjects } = require('D:/web/myblog/puppeteer/data/books/编程-simple.json')

const urls = subjects.map((item) => item.url)

console.log(name, urls.length) // 编程 1000

// 根据标签遍历1000本书
// getBookDetails(urls, {
//   delay: 6000,
//   type: name,
//   output: books_mdn_data // 存放路径
// })



// 获取一本或几本书
// getBookDetails(['https://book.douban.com/subject/26836700/'], {
//   delay: 5000,
//   type: '编程',
//   name: '输出文件名',
//   output: books_mdn_data // 存放路径，output下应有temp文件夹
// })


const bookBrief = require('../../models/bookBrief')
const { callback } = require('../../mongo/index')

async function index(query) {
  const brief = await bookBrief.find(query, callback).limit(10)
  const urls = brief.map((item) => item.url)
  const list = await getBookDetails(urls, { delay: 2000 })

  console.log(brief.length, urls, list)
  process.exit(0)
}

index({ driven: 1 })
