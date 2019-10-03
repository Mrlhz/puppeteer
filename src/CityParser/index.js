const path = require('path')

const puppeteer = require('puppeteer')
const c = require('ansi-colors')
require('module-alias/register')

const { executablePath } = require('@config/index')
const { proxyServer, auth } = require('@config/ip')
const { sleep, writeFile } = require('@helper/tools')
const { getAreaHtml } = require('./getAreaHtml')

let errs = [] // 存放出错的url


/**
 * @description 获取 `2018年统计用区划代码和城乡划分代码`
 * @see http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/index.html
 * @param {puppeteer.browser} browser
 * @param {Function} fn
 * @param {Object} options
 * @returns
 */
async function getArea(browser, fn , options) {
  let { urls, province } = options
  if(!Array.isArray(urls)) {
    console.log(urls, 'need Array')
    return
  }
  let len = urls.length
  let items = []
  for (let i = 0; i < len; i++) {
    let url = urls[i].url
    if(url) {
      const page = await browser.newPage()
      // await page.authenticate(auth)
      await page.setViewport({ width: 1920, height: 1200 })
  
      try {
        console.log(`${c.green('fetch')} ${url}`)
        await page.goto(url, {
          timeout: 0,
          waitUntil: 'networkidle2' // 当至少500毫秒的网络连接不超过2个时，考虑导航已经完成
        })
  
        let item  = await fn(page)
        try {
          items.push(...item)
          console.log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
        } catch (e) {
          console.log(`${c.bgRed('fail')} ${(i + 1)}/${len}`)
          errs.push(urls[i])
          console.log(e, i)
        }
        await page.close()
      } catch (e) {
        console.log(e)
      }
    }
    await sleep(4000)
  }
  return items
}


async function index(urls, options) {
  console.time('start')
  let { name = Date.now(), province, output = __dirname } = options
  let result = []
  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    ignoreHTTPSErrors: true,
    // args: [proxyServer]
  })

  let list = urls
  let names = ['city', 'county', 'town', 'village'].map((item) =>  province + '-' + item)
  for (let i = 0; i < names.length; i++) {
      list = await getArea(browser, getAreaHtml, {
      urls: list,
      province
    })
    await sleep(3000 + i * 600)
    result.push(...list)
    writeFile({
      fileName: names[i] + '.json',
      data: list,
      output
    })
  }

  writeFile({
    fileName: province + '-errs.json',
    data: errs,
    output
  })
  await browser.close()
  console.log(result.length)
  writeFile({
    fileName: province + '-result.json',
    data: result,
    output
  })
  console.timeEnd('start')
}


const pca = require('@area/province.min.json')
// index(pca.slice(19,20), {
//   name: 'gx',
//   province: 'gx',
//   output: path.resolve(__dirname, './data')
// })

console.log(pca.length)

// index(pca.slice(0,1), {
//   name: 'beijing',
//   province: 'beijing',
//   output: path.resolve(__dirname, './data')
// })

// 北京 1+1+16+336 个页面，每个页面延迟5s，共耗时2291147.657ms
// 天津 1+1+16+306 个页面，每个页面延迟5s，共耗时2523369.158ms
// 广东 1+21+200+2597 个页面，每个页面延迟4s，共耗时

// index(pca.slice(1,2), {
//   name: '天津市',
//   province: '天津市',
//   output: path.resolve(__dirname, './data')
// })


let target = pca.filter((item) => item.name === '广东省')

console.log(target);
// index(target, {
//   name: '广东省',
//   province: '广东省',
//   output: path.resolve(__dirname, './data')
// })
