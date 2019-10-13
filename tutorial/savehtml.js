const fs = require('fs')
const path = require('path')

const puppeteer = require('puppeteer')
const c = require('ansi-colors')
const axios = require('axios')

require('module-alias/register')

const { sleep, writeFile } = require('../src/helper/tools')
const { Browser } = require('../src/helper/browser')
const { executablePath } = require('@config/index')

async function saveHtml(urls, handleHtmlFunc, selector='', output, titles = []) {
  console.time('time')
  let len = urls.length
  const browser = new Browser({ headless: true })

  for (let i = 0; i < len; i++) {
    const page = await browser.goto(urls[i])

    try {
      let title = titles[i]
      if(!title) {
        title = await page.title()
        title = (1 + i) + '-' + title
      }

      title = title.replace(/[\\\/\:\*\?\"\<\>\|]/g, '-')
      const result = await handleHtmlFunc(page, selector)
      writeFile({
        fileName: title + '.html',
        data: result,
        output
      })

      console.log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)

      await sleep(2000)
      await page.close()
    } catch (e) {
      console.log(e)
    }
  }
  await browser.close()
  console.timeEnd('time')
}

async function getTrainVueInfoUrls(page) {
  return await page.evaluate(() => {
    let urls = []
    Array.from(document.querySelectorAll('.sidebar-links li > a.sidebar-link')).forEach((item) => {
      let url = item.getAttribute('href')
      if (url.indexOf('#') === -1) {
        urls.push(location.origin + url)
      }
    })
    return urls
  })
}

async function getTrainVueInfoPage(page, selector) {
  let result = await page.evaluate((selector) => {
    document.querySelector('.page-nav').innerHTML = '';
    return document.querySelector(selector).innerHTML
  }, selector)

  result = result.replace(/<span class="line-number">\d*<\/span>/g, '')
    .replace(/<br>/g, '')
    .replace('<p><img src="https:\/\/www\.fullstackjavascript\.cn\/wx\.png" alt=""><\/p>', '');
  return result;
}

async function getAheadUrls(page) {
  const urls = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.nav ul li > a')).map((item) => {
      const href = item.getAttribute('href')
      return {
        title: item.innerText,
        url: 'http://www.zhufengpeixun.cn/ahead/' + href
      }
    })
  })
  return urls
}

async function getSelectorPage(page, selector) {
  return await page.evaluate((selector) => {
    const ignore = document.querySelector('.copyright')
    ignore ? ignore.innerHTML = '' : ''
    const content = document.querySelector(selector)
    return content ? content.innerHTML : ''
  }, selector)
}

async function getJsBasePage(page) {
  await page.click('#catalog-31 .name-link')
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.typo-catalog-detail li a[title]')).map((item) => {
      return {
        title: item.getAttribute('title'),
        url: location.origin + item.getAttribute('href')
      }
    })
  })
}

async function getSomeFiles(urls, handleHtmlFunc, file, output='') {
  let items = []
  const instance = new Browser({
    headless: false
  })
  for (let i = 0; i < urls.length; i++) {
    const page = await instance.goto(urls[i])
    try {
      const item = await handleHtmlFunc(page)
      if (item.length === 0) {
        break
      }
      items.push(...item)
      await page.close()
    } catch (e) {
      console.log(e)
    }
  }
  writeFile({
    fileName: file,
    data: items,
    output: output || __dirname
  })

  await instance.close()
}

/**
 * `bug css样式丢失`
 */

function runMDN() {
  const urls = ['https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise']
  saveHtml(urls, getSelectorPage, '#wikiArticle', 'D:/books/mdn/html')
}


function runTrain() {
  /**
   * 1. run getTrainVueInfoUrls
   * 2. `http://www.zhufengpeixun.cn/train/vue-info/component.html` 珠峰架构课 - Vue.js顶尖高手特训营
   */
  getSomeFiles(['http://www.zhufengpeixun.cn/train/vue-info/component.html'], getTrainVueInfoUrls, 'train-vue-info-urls.json')
  const urls = require('./train-vue-info-urls.json')
  saveHtml(urls.slice(0, 1), getTrainVueInfoPage, 'main.page', 'D:/books/mdn/html/train-vue-info')
}

function runAhead(files) {
  /**
   * `http://www.zhufengpeixun.cn/ahead/index.html` 珠峰架构师成长计划
   */
  const filePath = path.resolve(__dirname, `./${files}`)
  if (!fs.existsSync(filePath)) {
    getSomeFiles(['http://www.zhufengpeixun.cn/ahead/index.html'], getAheadUrls, `${files}`)
  }

  let urls = require(`./${files}`)
  const titles = urls.map((item) => item.title)
  urls = urls.map((item) => item.url)
  saveHtml(urls, getSelectorPage, '.content.markdown-body', 'D:/books/mdn/html/ahead/html', titles)
  // saveHtml(['http://www.zhufengpeixun.cn/ahead/html/76.react_optimize.html'], getSelectorPage, '.content.markdown-body', 'D:/books/mdn/html/ahead', ['76.react_optimize'])

}

function runJsBase() {
  const output = 'D:/books/mdn/html/javascript基础教程'
  // getSomeFiles(['https://www.yuque.com/mabin/js_base'], getJsBasePage, 'urls.json', output)
  const urls = require(path.join(output, 'urls.json'))
  const titles = urls.map((item) => item.title)
  const u = urls.map((item) => item.url)

  let index = 0
  const names = titles.map((item) => {
    if(item[0] === '1') {
      index+=1
    }
    return index + '-' + item
  })
  // saveHtml(u, getSelectorPage, '.yuque-doc-content', output, names)
  saveHtml(['https://www.yuque.com/mabin/js_base/br48gb'], getSelectorPage, '.yuque-doc-content', output, ['12-3. 受控/非受控组件、React组件的生命周期'])
  
  console.log(names.length);
}

// runMDN()
// runTrain()
// runAhead('ahead-urls.json')
runJsBase()
