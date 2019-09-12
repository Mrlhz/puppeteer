const path = require('path');

const puppeteer = require('puppeteer');
const c = require('ansi-colors');
const axios = require('axios')

require('module-alias/register')

const { sleep, mkdirSync, writeFile } = require('../src/helper/tools')
const { executablePath } = require('@config/index')

async function saveHtml(urls) {
  let len = urls.length
  // for (let i = 0; i < len; i++) {
  //   let html = await axios.get(urls[i])
  //   writeFile(i + '.html', html.data,{
  //     output: 'D:/books/mdn/html'
  //   })
  //   await sleep(3000)
  // }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath
  });

  for (let i = 0; i < len; i++) {
    const page = await browser.newPage();

    await page.setViewport({
      width: 1920,
      height: 1200
    });

    try {
      console.log(`${c.green('fetch')} ${urls[i]}`);
      await page.goto(urls[i], {
        timeout: 0,
        waitUntil: 'networkidle2' // 当至少500毫秒的网络连接不超过2个时，考虑导航已经完成
      });

      await sleep(3000);
      // await page.emulateMedia('screen');
      let title = await page.title()

      let result = await page.evaluate(() => {
        return document.querySelector('body').innerHTML
      })

      writeFile(title.replace('|', '-') + '.html', result,{
        output: 'D:/books/mdn/html'
      })

      console.log(`${c.bgGreen('done')} ${(i + 1)}/${len}`);

      await sleep(3000)

      await page.close();
    } catch (e) {
      console.log(e);
    }
  }


  await browser.close();
}


// mkdirSync('D:/books/mdn/html')

/**
 * `bug css样式丢失`
 */
// saveHtml(['https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array'])

