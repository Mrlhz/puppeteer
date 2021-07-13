const process = require('process')
const c = require('ansi-colors')

const { connect } = require('../src/mongo/db')
const { seriesSchema, idolsSchema } = require('./models/series')
const { getLists } = require('./html/javbus')
const { Browser } = require('../src/helper/browser')
const { wait } = require('../src/helper/tools')
const { screenshot, showAll, filterVR, isMovieExist, getInputParams } = require('./utils/index')

const log = console.log
const db = connect('javbus')

/**
 * `0. 判断页面页码 ？`
 * `1. 输入urls 遍历`
 * `2. 容错处理`
 * `3. 保存截图 ？`
 * `4. 保存数据到数据库`
 */
 async function init(params) {
  let { urls, showall, delay = 3000 } = params
  console.log('params: ', { ...params })
  let result = [] // 统一返回数组
  const browser = new Browser({})

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
    const model = getSchema(params.type)
    const mask = data.map((item) => setData(model, item)) // default seriesSchema
    const { length } = await Promise.all(mask)
    log('success', length)
  } catch (e) {
    log(c.red(e))
  }
}

async function setData(model, item) {
  if (!item.av) return
  const { isExist } = await isMovieExist(model, item)
  if (isExist) {
    return item
  }
  const res = await new model(item).save()
  log(c.green('insert success:'), res.title, res.av)
  return res
}

function getSchema(type) {
  const schemaMap = {
    'series': seriesSchema,
    idols: idolsSchema
  }
  console.log(`${type}`, schemaMap[type])
  return schemaMap[type]
}

function handleType(str) {
  if (str) {
    return str.includes('star') ? 'idols' : 'series'
  }
  return 'series'
}

const { params } = getInputParams()

const type = handleType(params.urls)
console.log(type, 666)

init({
  gethtml: getLists,
  task: 'series',
  filePath: 'D:/md/avmoo',
  print: false,
  origin: true, // 更改url origin
  showall: false, // 全部影片
  type: 'series', // 默认数据库集合 series || idols
  urls: '',
  ...params,
  type
})


// process.exit(0)

// series 已有磁力
// node getSeries.js urls=https://avmask.com/cn/star/9c786fb6e8c34746 series=河北彩花
// node getSeries.js urls=https://www.busjav.blog/star/sl1 series=河北彩花 showall=true
// node getSeries.js urls=https://www.busjav.blog/series/1dj series=夫の目の前で犯されて
// node getSeries.js urls=https://www.busjav.blog/star/pmv series=橋本ありな type=idols
// node getSeries.js urls=https://www.busjav.blog/star/ufk series=月乃ルナ type=idols
// node getSeries.js urls=https://www.busjav.blog/star/b6a series=辻本杏 type=idols
// node getSeries.js urls=https://www.busjav.blog/star/b6a series=MOODYZFresh showall=true
// node getSeries.js urls=https://www.busjav.blog/star/rul series=高杉麻里

// node getSeries.js urls=https://www.busjav.blog/star/qz7 series=水卜さくら type=idols
// node getSeries.js urls=https://www.busjav.blog/series/3q3 series=私、実は夫の上司に犯●れ続けてます…
// node getSeries.js urls=https://www.busjav.blog/star/rxf series=架乃ゆら
// node getSeries.js urls=https://www.busjav.blog/star/fxo series=さくらゆら
// node getSeries.js urls=https://www.busjav.blog/star/vb3 series=松本いちか
