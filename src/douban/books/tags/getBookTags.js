const puppeteer = require('puppeteer')
const c = require('ansi-colors')

require('module-alias/register')

const { wait, writeFile } = require('D:/web/myblog/puppeteer/src/helper/tools')
const { executablePath } = require('@config/index')
const { getBookTagsHtml, getHotTagsHtml } = require('../html/getBookTagsHtml')
const bookTags = require('../../../models/bookTags')
const { db } = require('../../../mongo/db')

/**
 * @description 保存豆瓣图书标签json `https://book.douban.com/tag/?view=type`
 * @param {String} urlPath url
 * @param {Object} options
 */
async function getBookTags(url, getTargetHtml) {
  const browser = await puppeteer.launch({ executablePath })
  const page = await browser.newPage()
  await page.goto(url)
  console.log(c.green('fetch') + ' ' + url)
  await page.setViewport({ width: 1920, height: 1200 })

  await wait(3000)

  let result = await getTargetHtml(page)
  console.log(c.bold.yellow(result.length))

  await bookTags.insertMany(result, (err) => {
    if (err) console.log(err)
  })

  await browser.close()
}


/**
 * `豆瓣图书标签-分类浏览`
 */
getBookTags('https://book.douban.com/tag/?view=type', getBookTagsHtml)

/**
 * `豆瓣图书标签-所有热门标签`
 */
// getBookTags('https://book.douban.com/tag/?view=cloud')

