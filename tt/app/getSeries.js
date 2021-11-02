const process = require('process')
const c = require('ansi-colors')

const { connect } = require('../db')
const { seriesSchema, idolsSchema } = require('../models/series')
const { getLists } = require('../html/javbus')
const { Browser } = require('../../src/helper/browser')
const { wait } = require('../../src/helper/tools')
const { exportScreenshot, showAll, filterVR, isMovieExist, getInputParams } = require('../utils/index')

const log = console.log

/**
 * `0. 判断页面页码 ？`
 * `1. 输入urls 遍历`
 * `2. 容错处理`
 * `3. 保存截图 ？`
 * `4. 保存数据到数据库`
 */
 async function init(params) {
  let { href, showall, delay = 3000 } = params
  console.log('params: ', { ...params })
  let result = [] // 统一返回数组
  const browser = new Browser({})

  let pageNumber = 1
  while (pageNumber < 500) {
    const url = pageNumber === 1 ? href : `${href}/${pageNumber}`
    let page = await browser.goto(url)

    await showAll(page, showall) // 全部影片 || 已有磁力
    await wait(showall ? delay - 500 : delay)

    const items = await handleJavBusHtml({ page, ...params })
    await exportScreenshot({ page, ...params })
    await setSeriesData(items, params)
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
}


async function handleJavBusHtml(params) {
  const { page, gethtml } = params
  const data = await gethtml(page)
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
    const task = data.map((item) => setData(params.model, item))
    const { length } = await Promise.all(task)
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

function getSchema(collection) {
  const schemaMap = {
    'series': seriesSchema,
    idols: idolsSchema
  }
  return schemaMap[collection]
}

async function getSeries(params) {
  const model = getSchema(params.collection || 'idols') // default seriesSchema
  const db = await connect('javbus')
  await init({
    gethtml: getLists,
    filePath: 'D:/md/avmoo',
    print: false,
    origin: true, // 更改url origin
    showall: false, // 全部影片
    collection: 'idols', // 默认数据库集合 idols || series
    href: '',
    series: '', // 演员名
    model,
    ...params,
  })
}


// getSeries({ href: 'https://www.busjav.blog/star/w6u', series: '夏目響', collection: 'idols' })
// getSeries({ href: 'https://www.busjav.blog/series/9i4', series: '大人しい地味子', collection: 'series' })
module.exports = {
  getSeries
}
