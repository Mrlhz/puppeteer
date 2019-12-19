const process = require('process')

const c = require('ansi-colors')

const { wait, formatTime } = require('../../helper/tools')
const { Browser } = require('../../helper/browser')
const { getSearchListHtml } = require('./html/getSearchList')
const { connect } = require('../../mongo/db') // TODO 统一管理MongoDB
const doubanDb = connect('douban')

const searchBook = require('../../models/searchBook')
const log = console.log

/**
 * @description 获取豆瓣图书简介 e.g. `https://book.douban.com/tag/编程?start=0&type=T`，调用一次获取一页数据（20条）
 * @param {Array} urls
 * @param {Object} [options={}]
 * @todo 1
 */
async function getSearchBookList(urls, options = {}) {
  const { delay = 3000 } = options
  const len = urls.length
  const result = []
  const instance = new Browser({ headless: false })
  for (let i = 0; i < len; i++) {
    const page = await instance.goto(urls[i])
    try {
      const items = await getSearchListHtml(page)
      if(items.errMsg) {
        log(c.yellowBright(items.errMsg))
        break
      }
      
      for (let index = 0; index < items.length; index++) {
        const book = items[index]

        const b = await searchBook.findOne({id: book.id})
        if (b) {
          log(`${c.red('fail')}: ${book.title}(${book.id}) existed`)
        } else {
          const res = await new searchBook(book).save()
          log(c.green('insert success:'), res.title, res.rating)
        }
      }
      result.push(...items)
    } catch (e) {
      log(c.red(e))
    }
    if (i !== len - 1) await wait(delay)
    await page.close()
  }

  await instance.close()
  return result
}

module.exports = {
  getSearchBookList
}

/**
 * `测试`
 */
async function index(options = {}) {
  console.time('t');
  const process = require('process')
  const { keyword='', pageEnd = 10 } = options
  const urls = []
  for (let i = 0; i < pageEnd; i++) {
    urls.push(`https://search.douban.com/book/subject_search?search_text=${keyword.toLocaleLowerCase()}&cat=1001&start=${i * 15}`)
  }
  console.log(urls);
  const book = await searchBook.findOne({})
  console.log(book);
  const data = await getSearchBookList(urls,{})
  console.log(data)
  process.exit(0)
  console.timeEnd('t');
}

index({ keyword: 'python', pageEnd: 60 }) // 爬50页

