const path = require('path');

const c = require('ansi-colors');

const { wait, writeFile } = require('../../helper/tools')
const { books_mdn_data } = require('../../config/index')
const { formatUrls } = require('../../helper/urls')
const { Browser } = require('../browser')
const { getBookListByTagHtml } = require('./html/getBookListByTag')

/**
 * @description 获取豆瓣图书简介 e.g. `https://book.douban.com/tag/编程?start=0&type=T`，调取一次获取一页数据（20条）
 *
 * @param {Array} urls
 * @param {Object} [options={}]
 */
async function getBookListByTag(urls, options = {}) {
  const { delay = 3000, tag = '标签', typeName = '综合排序' } = options
  const len = urls.length
  let items = []
  const instance = new Browser()
  console.log(c.cyanBright(tag))
  for (let i = 0; i < len; i++) {
    const page = await instance.goto(urls[i])
    try {
      const item = await getBookListByTagHtml(page)
      items.push(...item)
      console.log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
    } catch (e) {
      console.log(`${c.bgGreen('fail')} ${(i + 1)}/${len}`)
    }
    await wait(delay)
    await page.close()
  }

  const result = {
    name: tag,
    type: typeName,
    total: items.length,
    subjects: items
  }

  writeFile(tag + '-simple.json', result, {
    output: books_mdn_data
  })
  
  await instance.close()
}


module.exports = {
  getBookListByTag
}


/**
 * `测试`
 */
const tag = '诗词'
const types = ['T', 'R', 'S'] // type[综合排序 T  |  按出版日期排序 R |  按评价排序 S]
const typeNames = ['综合排序', '按出版日期排序', '按评价排序']

const urls = formatUrls('https://book.douban.com/tag/%s?start=%s&type=%s', {
  tag,
  start: 0,
  end: 980,
  increase: 20,
  type: types[0]
})

// console.log(urls);

getBookListByTag(urls, {
  delay: 5000,
  tag,
  typeName: typeNames[0]
})
