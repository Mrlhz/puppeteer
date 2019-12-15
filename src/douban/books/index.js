const { getBookDetails } = require('./getBookDetails')
const bookBrief = require('../../models/bookBrief')
const { callback } = require('../../mongo/index')

// const { name, subjects } = require('D:/web/myblog/puppeteer/data/books/编程-simple.json')

/**
 * `测试`
 */
async function index(query, limit = 1000) {
  const brief = await bookBrief.find(query, callback).limit(limit)
  const urls = brief.map((item) => item.url)
  const tags = brief.map((item) => item.tag)

  console.log(brief.length, urls)
  const list = await getBookDetails(urls, { delay: 4100, tags })

  process.exit(0)
}

index({
  valid: true,
  driven: 1,
  rating: {
    $gte: 9
  }
}, 100)

// index({
//   tag: {
//     $in: ['名著']
//   },
//   driven: 1
// })

// 条目不存在
// index({ id: 26870315 })
