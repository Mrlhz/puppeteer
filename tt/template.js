const path = require('path')
const process = require('process')
const c = require('ansi-colors')

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
 * `3. 保存截图 ？`
 * `4. 保存数据到数据库`
 */
async function init(params) {
  let { urls } = params
  let result = [] // 统一返回数组
  const browser = new Browser({})

  if (Array.isArray(urls)) {
    for (let i = 0, len = urls.length; i < len; i++) {
      const url = urls[i]
      const page = await browser.goto(url)
      const items = await template({ page, ...params })
      result.push(...items)
      log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
      await page.close()
    }
  } else if (typeof urls === 'string') {
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

/**
 *
 * @description `getHtml`
 * @param {object} params
 * @returns {Array} 
 */
async function template(params) {
  const { page, gethtml, task, series, print, pageNumber, filePath, delay = 3000 } = params

  const data = await gethtml(page)
  if (task === 'series') {
    await setSeriesData(data, series)
  } else if (task === 'movies') {
    await setMoviesData(data)
  }

  if (print) {
    await pdf({ page, pageNumber, filePath })
  }

  await wait(delay)

  return data
}

async function setSeriesData(data, series='') {
  try {
    data = data.map((item) => { item.series = series; return item })
    const mask = data.map((item) => setData(seriesSchema, item))
    const { length } = await Promise.all(mask)
    log('success', length)
  } catch (e) {
    log(c.red(e))
  }
}

async function setMoviesData(data) {
  try {
    const mask = data.map((item) => setData(movieSchema, item))
    const [ { av, star } ] = await Promise.all(mask)
    if (star) {
      console.log('update1', av);
      const updated = Date.now() + 8 * 60 * 60 * 1000
      const update = await seriesSchema.findOneAndUpdate({ av }, { $set: { driven: 0, updated } })
      log('opdate:', update)
    }
  } catch (e) {
    log(c.red(e))
  }
}

async function setData(model, item) {
  const m = await model.findOne({ av: item.av })
  if (m) {
    log(`${c.red('fail')}: ${item.title}(${item.av}) existed`)
    // if (!m.series) {
    //   const update = await seriesSchema.findOneAndUpdate({ av: item.av }, { $set: { series: '' } })
    //   log(update, 'update')
    // }
    return m
  } else {
    const res = await new model(item).save()
    log(c.green('insert success:'), res.title, res.av)
    return res
  }
}


async function pdf(pdfParams) {
  const { page, pageNumber, filePath } = pdfParams
  let title = await page.title()
  title = pageNumber ? `${title}-page-${pageNumber}` : title
  await page.screenshot({
    path: path.resolve(filePath, `${title}.png`), // todo
    fullPage: true
  })
}


module.exports = {
  init
}
