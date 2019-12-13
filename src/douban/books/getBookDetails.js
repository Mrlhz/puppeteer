const path = require('path')

const c = require('ansi-colors')

const { proxyServer } = require('../../config/ip')
const { wait, writeFile } = require('../../helper/tools')
const { Browser } = require('../../helper/browser')
const { getBookDetailsHtml } = require('./html//getBookDetailsHtml')
const { insertOne, updateOneById } = require('../../mongo/index')
const bookBrief = require('../../models/bookBrief')
const book = require('../../models/book')
const { showAll } = require('../util')

/**
 * @description 获取豆瓣图书简介 e.g. `https://book.douban.com/subject/27028517/`
 * @param {Array} urls 导航的地址
 * @param {Object} [options={}]
 * @todo 效率低，豆瓣IP限制
 */
async function getBookDetails(urls, options = {}) {
  console.time('time')
  const { delay = 3000, tags = [] } = options
  const len = urls.length
  let items = []
  const instance = new Browser({
    // args: [proxyServer]
  })

  for (let i = 0; i < len; i++) {
    const page = await instance.goto(urls[i]) // 'proxy'
    console.log('title', await page.title())
    await showAll(page, ['.j.a_show_full']) // 内容简介 展开全部
    try {
      const item = await getBookDetailsHtml(page)
      if(item.errMsg) {
        console.log(c.yellowBright(item.errMsg))
        break
      }
      // save
      item.category = tags[i]
      const res = await insertOne(book, item)
      console.log(res, 'res')
      if (res) await updateOneById(bookBrief, item.id, { $set: { driven: 0 } })
      items.push(item)
      console.log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
    } catch (e) {
      console.log(`${c.bgGreen('fail')} ${(i + 1)}/${len}`)
    }
    if (len > 1) await wait(delay)
    await page.close()
  }

  await instance.close()
  console.timeEnd('time')
}

module.exports = {
  getBookDetails
}

// 内容简介需要展开 e.g.
// https://book.douban.com/subject/1446625/
// https://book.douban.com/subject/27028517/
