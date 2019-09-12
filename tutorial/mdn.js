const path = require('path');

const puppeteer = require('puppeteer');
const c = require('ansi-colors');

const { sleep, mkdirSync, writeFile } = require('../src/helper/tools')

const { mdn } = require('../src/config/index')

// 创建 mdn目录
// mkdirSync(path.resolve(__dirname, '../data/mdn'))

/**
 * @description 获取`JavaScript 相关主题`列表
 *
 * @param {String} url
 */
async function main(url, topic='快速入门') {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'D:/softwares/Chromium_v692609/chrome-win/chrome.exe'
  })
  const page = await browser.newPage()

  await page.setViewport({
    width: 1920,
    height: 1200
  });

  await page.goto(url, {
    timeout: 0,
    waitUntil: 'networkidle2' // 当至少500毫秒的网络连接不超过2个时，考虑导航已经完成
  });

  await sleep(3000)
  
  page.on('console', msg => {
    for (let i = 0; i < msg.args().length; ++i)
      console.log(`${i}: ${msg.args()[i]}`) // 打印到你的代码的控制台
  });

  const result = await handleHtml(page, topic)

  writeFile(topic + '.json', result, { output: mdn })

  await browser.close()
}

/**
 * @description 获取主题`href`
 *
 * @param {puppeteer.page} page
 * @returns
 */
async function handleHtml(page, topic) {
  try {
    let result = await page.evaluate((topic) => {
      let list = []
  
      document.querySelectorAll('.quick-links li').forEach((item, index) => {
        let summary = item.querySelector('details summary')
        // 关键字quick-links
        if(summary && summary.innerText === topic) {
          console.log(item, index);
          item.querySelectorAll('ol li a').forEach((a) => {
            let url = location.origin + a.getAttribute('href') // 'https://developer.mozilla.org'
            list.push(decodeURIComponent(url))
          })
        }
      })
  
      return list
    }, topic)
    return result
  } catch (e) {
    console.log(e)
  }
}

main('https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects', '语句和声明')

const u = require(path.resolve(mdn, 'Global_Objects_urls.json'))
console.log(u);


var topics =  ["快速入门", "JavaScript 指南", "中级教程", "高级", "内置对象", "表达式和运算符", "语句和声明", "函数", "Classes", "Errors", "更多", "New in JavaScript", "常用列表", "贡献"]
// var quickLinks = Array.from(document.querySelectorAll('.quick-links li.toggle')).map((item) => {
//   return item.innerText
// })

// 'https://developer.mozilla.org' + document.querySelectorAll('ol').item(7).querySelectorAll('li a')[0].getAttribute('href')