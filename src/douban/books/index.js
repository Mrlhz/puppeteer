const { getBookDetails } = require('./getBookDetails')
const bookBrief = require('../../models/bookBrief')
const { callback } = require('../../mongo/index')
const { formatTime } = require('../../helper/tools')

// const { name, subjects } = require('D:/web/myblog/puppeteer/data/books/编程-simple.json')

function randomArray(n = 200, rangeL = 2000, rangeR = 5000) {
  if (rangeL > rangeR) return

  let array = []
  for (let i = 0; i < n; i++) {
    array[i] = Math.floor(Math.random() * (rangeR - rangeL + 1)) + rangeL
  }
  return array
}

/**
 * `测试`
 */
async function index(query, limit = 1000) {
  let start = formatTime()
  const brief = await bookBrief.find(query, callback).limit(limit)
  const urls = brief.map((item) => item.url)
  const tags = brief.map((item) => item.tag)

  console.log(brief.length, urls)
  const delay = randomArray(limit, 1000, 6000)
  const list = await getBookDetails(urls, { delay, tags })

  console.log(`start: ${start}`)
  console.log(`end: ${formatTime()}`)
  process.exit(0)
}

index({
  valid: true,
  driven: 1,
  // rating: {
  //   $gte: 5
  // }
}, 200)

// index({
//   tag: {
//     $in: ['名著']
//   },
//   driven: 1
// })

// 条目不存在
// index({ id: 26870315 })
