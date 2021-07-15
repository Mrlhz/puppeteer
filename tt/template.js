const path = require('path')
const process = require('process')
const c = require('ansi-colors')

const { seriesSchema, idolsSchema } = require('./models/series')
const { movieSchema, starVideoSchema } = require('./models/javbus')

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
  let { dataInfo, urls, showall, delay = 3000 } = params
  console.log('params: ', { ...params, dataInfo: dataInfo ? dataInfo.length: 0 })
  let result = [] // 统一返回数组
  const browser = new Browser({})

  if (Array.isArray(dataInfo)) {
    const model = getMoiveSchema(params.type)
    console.log('init ', model)
    for (let i = 0, len = dataInfo.length; i < len; i++) {
      const url = dataInfo[i].url
      const { isExist } = await isMovieExist(model, dataInfo[i])
      if (isExist) {
        continue
      }
      const page = await browser.goto(url)
      const items = await template({ page, ...params })
      result.push(...items)
      log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
      await page.close()
    }
  } else if (typeof urls === 'string') {
    let pageNumber = 1
    while (pageNumber < 500) {
      const url = pageNumber === 1 ? urls : `${urls}/${pageNumber}`
      let page = await browser.goto(url)

      await showAll(page, showall) // 全部影片 || 已有磁力
      await wait(showall ? delay - 500 : delay)

      const items = await template({ page, ...params })
      result.push(...items)
      const nextPage = await page.$('#next')
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
 * @description `getHtml`
 * @param {object} params
 * @returns {Array}
 */
async function template(params) {
  const { page, gethtml, task, series, print, filePath } = params

  const data = await gethtml(page)
  if (task === 'series') {
    await setSeriesData(data, params)
  } else if (task === 'movies') {
    await setMoviesData(data, params)
  }

  if (print) {
    await screenshot({ page, filePath })
  }

  return data
}

/**
 * @description 保存电影简略信息
 * @param {Array} data
 * @param {Object} params
 */
async function setSeriesData(data, params) {
  const list = filterVR(data)
  try {
    data = list.map((item) => { item.series = params.series; return item })
    const mask = data.map((item) => setData(params, item)) // default seriesSchema
    const { length } = await Promise.all(mask)
    log('success', length)
  } catch (e) {
    log(c.red(e))
  }
}

async function setMoviesData(data, params) {
  try {
    const mask = data.map((item) => {
      item['idols'] = params.series
      return setData(params, item) // default movieSchema
    })
    const [ { av, star } ] = await Promise.all(mask)
    if (star) {
      console.log('update1', av)
      const updated = Date.now() + 8 * 60 * 60 * 1000
      const _seriesSchema = getSchema(params.type === 'starVideo' ? 'idols' : 'series')
      const update = await _seriesSchema.findOneAndUpdate({ av }, { $set: { driven: 0, updated } })
      // log('opdate:', update)
    }
  } catch (e) {
    log(c.red(e))
  }
}

async function _setData(model, item) {
  // console.log(100, item)
  if (!item.av) return
  const m = await model.findOne({ av: item.av })
  if (m) {
    log(`${c.red('fail')}: ${item.title}(${item.av}) existed`)
    return m
  } else {
    const res = await new model(item).save()
    log(c.green('insert success:'), res.title, res.av)
    return res
  }
}

async function setData(params, item) {
  if (!item.av) return
  const model = getMoiveSchema(params.type) || getSchema(params.type)
  console.log('schema', model)

  const { isExist } = await isMovieExist(model, item)
  if (isExist) {
    return item
  }
  const res = await new model(item).save()
  log(c.green('insert success:'), res.title, res.av)
  return res
}


async function screenshot(pdfParams) {
  const { page, filePath } = pdfParams
  const { pagination } = await page.evaluate(() => {
    document.querySelectorAll('.ad-table').forEach((ad) => {
      ad.style.display = 'none' // 隐藏广告
    })
    let pagination = document.querySelector('.pagination .active')
    pagination = pagination ? pagination.innerText : '' // 当前页面
    return { pagination }
  })

  let title = await page.title()
  title = pagination ? `${title}-page-${pagination}` : title

  await page.screenshot({
    path: path.resolve(filePath, `${title}.png`), // todo
    fullPage: true
  })
}


async function showAll(page, showall) {
  if (showall && page.$('#resultshowall')) {
    const resultshowall = page.$('#resultshowall')
    resultshowall ? page.click('#resultshowall') : ''
  }
}

function filterVR(data) {
  const vrs = []
  const list = []
  data.forEach((item) => {
    item.title.indexOf('【VR】') === -1 ? list.push(item) : vrs.push(item)
  })

  log(vrs, 'ignore')
  return list
}

function getMoiveSchema(type) {
  const schemaMap = {
    movie: movieSchema,
    starVideo: starVideoSchema
  }
  console.log(`getMoiveSchema: ${type}`, schemaMap[type])
  return schemaMap[type]
}

function getSchema(type) {
  const schemaMap = {
    'series': seriesSchema,
    idols: idolsSchema
  }
  console.log(`getSchema: ${type}`, schemaMap[type])
  return schemaMap[type]
}

async function isMovieExist(model, movieInfo) {
  let isExist = false
  const m = await model.findOne({ av: movieInfo.av })
  if (m) {
    log(`${c.red('fail')}: ${movieInfo.title}(${movieInfo.av}) existed`)
    isExist = true
  }
  return { isExist }
}


module.exports = {
  init
}
