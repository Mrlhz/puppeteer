const path = require('path')
const process = require('process')
const c = require('ansi-colors')

const { connect } = require('../db')
const { seriesSchema, idolsSchema } = require('../models/series')
const { movieSchema, starVideoSchema } = require('../models/javbus')
const { getOne } = require('../html/javbus')
const { Browser } = require('../../src/helper/browser')
const { wait } = require('../../src/helper/tools')
const { setOrigin, isMovieExist, exportScreenshot, getInputParams } = require('../utils/index')

const log = console.log

/**
 * `0. 判断页面页码 ？`
 * `1. 输入urls 遍历`
 * `2. 容错处理`
 * `3. 保存截图 ？`
 * `4. 保存数据到数据库`
 */
async function init(params) {
  let { dataInfo, seriesCollection, movieCollection, delay = 3000 } = params
  let result = [] // 统一返回数组
  const browser = new Browser({})

  if (Array.isArray(dataInfo)) {
    for (let i = 0, len = dataInfo.length; i < len; i++) {
      const url = dataInfo[i].url
      console.log('moiveSchema', movieCollection)
      const { isExist } = await isMovieExist(movieCollection, dataInfo[i])
      if (isExist) {
        log(`${c.bgYellow('exists')} ${(i + 1)}/${len}`)
        continue
      }
      const page = await browser.goto(url)
      const [items] = await handleJavBusHtml({ page, ...params })
      await setMoviesData([items], { ...params, seriesCollection, movieCollection })
      await exportScreenshot(params)
      // console.log('items', items)
      const { av, star } = items
      if (!av) {
        // !star.length 暫無出演者資訊
        log(`${c.bgRed('fail')} 404 Page Not Found! ${(i + 1)}/${len}`, items)
        continue
      }
      result.push(items)
      log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
      await page.close()
    }
  }

  await browser.close()
  // process.exit(0)
}

/**
 * @description `getHtml`
 * @param {object} params
 * @returns {Array}
 */
async function handleJavBusHtml(params) {
  const { page, gethtml } = params

  const data = await gethtml(page)
  return data
}

async function setMoviesData(data, params) {
  try {
    const task = data.map((item) => {
      item['idols'] = params.series
      return setData(params, item) // default movieSchema
    })
    const [ { av, star } ] = await Promise.all(task)
    if (!av || !star.length) {
      return
    }

    if (av) {
      console.log('update av', av)
      const updated = Date.now() + 8 * 60 * 60 * 1000
      const { seriesCollection } = params
      const update = await seriesCollection.findOneAndUpdate({ av }, { $set: { driven: 0, updated } })
      // log('opdate:', update)
    }
  } catch (e) {
    log(c.red(e))
  }
}

async function setData(params, item) {
  console.log(item.av)
  if (!item.av) return []
  const { movieCollection } = params
  const { isExist } = await isMovieExist(movieCollection, item)
  if (isExist) {
    return item
  }
  const res = await new movieCollection(item).save()
  log(c.green('insert success:'), res.title, res.av)
  return res
}

function getMoiveSchema(type) {
  const schemaMap = {
    starVideo: starVideoSchema,
    movie: movieSchema,
    idols: starVideoSchema,
    series: movieSchema
  }
  return schemaMap[type]
}

function getSchema(collection) {
  // const type = collection === 'starVideo' ? 'idols' : 'series'
  const schemaMap = {
    idols: idolsSchema,
    series: seriesSchema
  }
  return schemaMap[collection]
}

async function queryMovies({ seriesCollection, limit, origin } = {}, conditions = { driven: 1 }) {
  const data = await seriesCollection.find(conditions).limit(limit)

  origin ? data.forEach(item => { item.url = setOrigin(item.url, 'busjav') }) : ''
  return data
}

async function getMovies(params) {
  const db = await connect('javbus')

  let { collection, series } = params
  const conditions = { series }
  const seriesCollection = getSchema(collection)
  const movieCollection = getMoiveSchema(collection)
  const data = await queryMovies({ ...params, seriesCollection }, conditions)
  console.log(data[0], movieCollection, seriesCollection)
  await init({
    dataInfo: data,
    gethtml: getOne,
    task: 'movie',
    filePath: 'D:/md/avmoo', // 截屏导出目录
    print: false,
    origin: true, // 更改url origin
    seriesCollection,
    movieCollection,
    ...params
  })
}

// getMovies({
//   series: '夏目響',
//   collection: 'idols', // 默认数据库集合 'idols': starVideo || 'series': movie
//   limit: 1000
// })

// getMovies({
//   series: '大人しい地味子',
//   collection: 'series', // 默认数据库集合 'idols': starVideo || 'series': movie
//   limit: 1000,
//   origin: true
// })

module.exports = {
  getMovies
}
