const path = require('path')

const puppeteer = require('puppeteer')
const c = require('ansi-colors')

const { sleep, mkdirSync, writeFile } = require('../src/helper/tools')
const { Browser } = require('../src/helper/browser')
const { mdn } = require('../src/config/index')

// 创建 mdn目录
// mkdirSync(path.resolve(__dirname, '../data/mdn'))

/**
 * @description 获取`JavaScript 相关主题`列表
 * @param {String} url
 * @param {String} [topic='快速入门']
 */
async function main(url, topic = '快速入门') {
  const browser = new Browser({
    headless: true
  })
  const page = await browser.goto(url)
  await sleep(300)
  const result = await getTargetPageHtml(page, topic)

  writeFile(topic + '.json', result, {
    output: mdn
  })
  await browser.close()
}

/**
 * @description 获取`MDN`主题`href`
 * @param {puppeteer.page} page
 * @returns
 */
async function getTargetPageHtml(page, topic) {
  try {
    return await page.evaluate((topic) => {
      let list = []
      document.querySelectorAll('.quick-links li').forEach((item, index) => {
        let summary = item.querySelector('details summary')
        // 关键字quick-links
        if (summary && summary.innerText === topic) {
          console.log(item.innerText, index)
          item.querySelectorAll('ol li a').forEach((a) => {
            const url = location.origin + a.getAttribute('href') // 'https://developer.mozilla.org'
            list.push(decodeURIComponent(url))
          })
        }
      })
      return list
    }, topic)
  } catch (e) {
    console.log(e)
  }
}

main('https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects', '语句和声明')

const u = require(path.resolve(mdn, 'Global_Objects_urls.json'))
// console.log(u)

const topics = ["快速入门", "JavaScript 指南", "中级教程", "高级", "内置对象", "表达式和运算符", "语句和声明", "函数", "Classes", "Errors", "更多", "New in JavaScript", "常用列表", "贡献"]
// var quickLinks = Array.from(document.querySelectorAll('.quick-links li.toggle')).map((item) => {
//   return item.innerText
// })

// 'https://developer.mozilla.org' + document.querySelectorAll('ol').item(7).querySelectorAll('li a')[0].getAttribute('href')