const path = require('path')

const puppeteer = require('puppeteer')
const c = require('ansi-colors')
const axios = require('axios')

require('module-alias/register')

const { sleep, mkdirSync, writeFile } = require('../src/helper/tools')
const { Browser } = require('../src/helper/browser')
const { executablePath } = require('@config/index')

async function saveHtml(urls, handleHtmlFunc, selector, output, titles = []) {
  console.time('time')
  let len = urls.length
  const browser = await puppeteer.launch({
    headless: true,
    executablePath
  })

  for (let i = 0; i < len; i++) {
    const page = await browser.newPage()

    await page.setViewport({
      width: 1920,
      height: 1200
    })

    try {
      console.log(`${c.green('fetch')} ${urls[i]}`)
      await page.goto(urls[i], {
        timeout: 0,
        waitUntil: 'networkidle2' // 当至少500毫秒的网络连接不超过2个时，考虑导航已经完成
      })

      await sleep(3000)
      // await page.emulateMedia('screen')
      let title = titles[i]
      if(!title) {
        title = await page.title()
        title = (1 + i) + '-' + title.replace(/[\\\/\:\*\?\"\<\>\|]/g, '-')
      }

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
    const content = document.querySelector(selector)
    return content ? content.innerHTML : ''
  }, selector)
}

async function getSomeFiles(urls, handleHtmlFunc, file) {
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
    output: path.resolve(__dirname)
  })

  await instance.close()
}

// mkdirSync('D:/books/mdn/html')

/**
 * `bug css样式丢失`
 */
// const urls = ['https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array']
// saveHtml(urls, getSelectorPage, '#wikiArticle', 'D:/books/mdn/html')

/**
 * 1. run getTrainVueInfoUrls
 * 2. `http://www.zhufengpeixun.cn/train/vue-info/component.html`
 */
// getSomeFiles(['http://www.zhufengpeixun.cn/train/vue-info/component.html'], getTrainVueInfoUrls, 'train-vue-info-urls.json')
// const urls = require('./train-vue-info-urls.json')
// saveHtml(urls.slice(0, 1), getTrainVueInfoPage, 'main.page', 'D:/books/mdn/html/train-vue-info')

/**
 * `http://www.zhufengpeixun.cn/ahead/index.html`
 */
// getSomeFiles(['http://www.zhufengpeixun.cn/ahead/index.html'], getAheadUrls, 'ahead-urls.json')

// let urls = require('./ahead-urls.json')
// const titles = urls.map((item) => item.title)
// urls = urls.map((item) => item.url)
// saveHtml(urls, getSelectorPage, '.content.markdown-body', 'D:/books/mdn/html/ahead', titles)


function getUrlParams(sUrl, sKey) {
  if (!sUrl) return {}

  const index = sUrl.indexOf('?')
  if (index !== -1) sUrl = sUrl.substring(index + 1)
  
  const hashIndex = sUrl.indexOf('#')
  if (hashIndex !== -1) sUrl = sUrl.substring(0, hashIndex)

  const params = {}
  decodeURIComponent(sUrl).split('&').forEach((param) => {
    const [key, value] = param.split('=')
    if (!params[key]) {
      params[key] = value
    } else {
      params[key] = Array.isArray(params[key]) ? params[key] : [params[key]]
      params[key].push(value)
    }
  })

  if (sKey && params[sKey]) {
    return params[sKey]
  }
  return params
}

// getUrlParams('http://www.nowcoder.com?key=1&key=2&key=3&test=4#hehe')
// getUrlParams('https://www.baidu.com/s?ie=UTF-8&wd=%E5%88%98%E4%BA%A6%E8%8F%B2')
getUrlParams('https://cli.vuejs.org/zh/guide/cli-service.html#使用命令')
getUrlParams('https://translate.google.cn/#view=home&op=translate&sl=auto&tl=en&text=原始url')