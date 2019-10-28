const path = require('path')
const process = require('process')
const c = require('ansi-colors')

const { db } = require('./db')
const { seriesSchema } = require('./models/series')
const { movieSchema } = require('./models/movie')
const { getLists } = require('./html/series')
const { getHtml } = require('./html/movie')

const { Browser } = require('../src/helper/browser')
const { wait } = require('../src/helper/tools')

const log = console.log

/**
 * `0. 判断页面页码 ？`
 * `1. 输入urls 遍历`
 * `2. 容错处理`
 * `3. 保存截图`
 * `4. 保存数据到数据库`
 */
async function init(params) {
  let { urls } = params
  const result = [] // 统一返回数组吧
  const browser = new Browser({})
  console.log(urls)

  if (Array.isArray(urls)) {
    for (let i = 0, len = urls.length; i < len; i++) {
      const url = urls[i]
      const page = await browser.goto(url)
      const items = await template({ page, ...params })
      result.push(...items)
      log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
      await page.close()
    }
  } else if (typeof urls === 'string'){
    let pageNumber = 1
    while (pageNumber < 500) {
      const page = await browser.goto(`${urls}/page/${pageNumber}`)
      const items = await template({ page, pageNumber, ...params })
      result.push(...items)
      const nextPage = await page.$('a[name*="nextpage"]')
      if (!nextPage) {
        log(c.yellowBright(`stop on the ${pageNumber} page`))
        break
      }

      pageNumber++
      await page.close()
    }
  }

  await browser.close()
  process.exit(0)
}


async function template(params) {
  const { page, gethtml, filePath, model, pageNumber, delay = 3000, pdf } = params

  const result = await gethtml(page)
  if (pdf) {
    let title = await page.title()
    title = pageNumber ? `${title}-page-${pageNumber}` : title
    await page.screenshot({
      path: path.resolve(filePath, `${title}.png`), // todo
      fullPage: true
    })
  }

  const mask = result.map((item) => setData(model, item))
  const [ { av, star } ] = await Promise.all(mask)

  if (star) {
    console.log('update1', av);
    const updated = Date.now() + 8 * 60 * 60 * 1000
    const update = await seriesSchema.findOneAndUpdate({ av }, { $set: { driven: 0, updated } })
    log('opdate:', update)
  }
  await wait(delay)

  return result
}

async function setData(model, data) {
  const m = await model.findOne({ av: data.av })
  if (m) {
    log(`${c.red('fail')}: ${data.title}(${data.av}) existed`)
    return m
  } else {
    const res = await new model(data).save()
    log(c.green('insert success:'), res.title, res.av)
    return res
  }
}


module.exports = {
  init
}
