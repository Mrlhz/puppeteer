const c = require('ansi-colors')


const { Browser } = require('../src/helper/browser')
const { wait } = require('../src/helper/tools')
const { getHtml } = require('./html/movie')

const log = console.log


async function init(params) {
  let { urls, delay = 3000 } = params
  let result = [] // 统一返回数组
  const browser = new Browser({})

  if (Array.isArray(urls)) {
    for (let i = 0, len = urls.length; i < len; i++) {
      const url = urls[i]
      const page = await browser.goto(url)
      const items = await getHtml(page)
      await wait(delay)
      result.push(...items)
      log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
      await page.close()
    }
  }
  log(result)

  await browser.close()
  process.exit(0)
}


init({
  urls: ['https://www.fanbus.bid/STARS-232']
})
