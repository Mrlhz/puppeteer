const path = require('path');

const puppeteer = require('puppeteer');
const c = require('ansi-colors');

const { sleep, mkdirSync, writeFile } = require('../src/helper/tools')

const { mdn } = require('../src/config/index')

// 'https://developer.mozilla.org' + document.querySelectorAll('ol').item(7).querySelectorAll('li a')[0].getAttribute('href')

// 创建 mdn目录
// mkdirSync(path.resolve(__dirname, '../data/mdn'))

/**
 * @description 获取`JavaScript 标准内置对象`列表
 *
 * @param {String} url
 */
async function main(url) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'D:/softwares/Chromium_v692609/chrome-win/chrome.exe'
  });
  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1200
  });

  await page.goto(url, {
    timeout: 0,
    waitUntil: 'networkidle2' // 当至少500毫秒的网络连接不超过2个时，考虑导航已经完成
  });

  await sleep(3000);
  
  page.on('console', msg => {
    for (let i = 0; i < msg.args().length; ++i)
      console.log(`${i}: ${msg.args()[i]}`); // 打印到你的代码的控制台
  });

  let result = await page.evaluate(() => {
    let list = []

    document.querySelectorAll('#quick-links li').forEach((item, index) => {
      let summary = item.querySelector('details summary')
      if(summary && summary.innerText === '内置对象') {
        console.log(item, index);
        item.querySelectorAll('ol li a').forEach((a) => {
          let url = location.origin + a.getAttribute('href') // 'https://developer.mozilla.org'
          list.push(url)
        })
      }
    })

    return list
  })

  writeFile('Global_Objects.json', result, { output: mdn });

  await browser.close();
}

// main('https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects')

const u = require(path.resolve(mdn, 'Global_Objects_urls.json'))
console.log(u);