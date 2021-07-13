const path = require('path')
const process = require('process')
const c = require('ansi-colors')

const { connect } = require('../src/mongo/db')
const { seriesSchema, idolsSchema } = require('./models/series')
const { movieSchema, starVideoSchema } = require('./models/javbus')
const { getOne } = require('./html/javbus')
const { Browser } = require('../src/helper/browser')
const { wait } = require('../src/helper/tools')
const { setOrigin, isMovieExist, getInputParams } = require('./utils/index')

const log = console.log
const db = connect('javbus')

// 开车 将文档series中的作品集合简略信息，遍历存到movies文档中
async function getMovies(options, conditions={ driven: 1 }) {
  const { limit = 30, origin, type } = options
  const schema = type === 'starVideo' ? idolsSchema : seriesSchema
  const data = await schema.find(conditions).limit(limit)
  origin ? data.forEach(item => item.url = setOrigin(item.url)) : ''
  init({
    dataInfo: data,
    gethtml: getOne,
    ...options
  })
  return data
}

/**
 * `0. 判断页面页码 ？`
 * `1. 输入urls 遍历`
 * `2. 容错处理`
 * `3. 保存截图 ？`
 * `4. 保存数据到数据库`
 */
async function init(params) {
  let { dataInfo, delay = 3000 } = params
  let result = [] // 统一返回数组
  const browser = new Browser({})

  if (Array.isArray(dataInfo)) {
    for (let i = 0, len = dataInfo.length; i < len; i++) {
      const url = dataInfo[i].url
      const model = getMoiveSchema(params.type)
      console.log('moiveSchema', model)
      const { isExist } = await isMovieExist(model, dataInfo[i])
      if (isExist) {
        log(`${c.bgYellow('exists')} ${(i + 1)}/${len}`)
        continue
      }
      const page = await browser.goto(url)
      const [items] = await template({ page, ...params, model })
      // console.log('items', items)
      const { av, star } = items
      if (!av || !star.length) {
        log(`${c.bgRed('fail')} 404 Page Not Found! ${(i + 1)}/${len}`)
        continue
      }
      result.push(items)
      log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
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
  const { page, gethtml, task, series, print, filePath, model } = params

  const data = await gethtml(page)
  await setMoviesData(data, params)

  if (print) {
    await screenshot({ page, filePath })
  }

  return data
}

async function setMoviesData(data, params) {
  try {
    const mask = data.map((item) => {
      item['idols'] = params.series
      return setData(params, item) // default movieSchema
    })
    const [ { av, star } ] = await Promise.all(mask)
    if (!av || !star.length) {
      return
    }

    if (av) {
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


async function setData(params, item) {
  console.log(item.av)
  if (!item.av) return []
  const model = getMoiveSchema(params.type)
  const { isExist } = await isMovieExist(model, item)
  if (isExist) {
    return item
  }
  const res = await new model(item).save()
  log(c.green('insert success:'), res.title, res.av)
  return res
}

function getMoiveSchema(type) {
  const schemaMap = {
    movie: movieSchema,
    starVideo: starVideoSchema
  }
  console.log(`${type}`, schemaMap[type])
  return schemaMap[type]
}

function getSchema(type) {
  const schemaMap = {
    'series': seriesSchema,
    idols: idolsSchema
  }
  console.log(`${type}`, schemaMap[type])
  return schemaMap[type]
}

const { params, conditions } = getInputParams()

const conditionParams =  Object.keys(conditions).length ? conditions : {}
console.log(params, conditions)


getMovies({
  gethtml: getOne,
  task: 'movie',
  filePath: 'D:/md/avmoo',
  print: false,
  origin: true, // 更改url origin
  type: 'movie', // 默认数据库集合 movie || starVideo
  limit: 1000,
  ...params
}, conditionParams)


// node getMovie.js task=movies limit=100 conditions=series:高杉麻里 series=高杉麻里 type=starVideo
// node getMovie.js task=movies limit=100 conditions=series:水卜さくら series=水卜さくら type=starVideo
// node getMovie.js task=movies limit=100 conditions=series:架乃ゆら series=架乃ゆら type=starVideo
// node getMovie.js task=movies limit=100 conditions=series:さくらゆら series=さくらゆら type=starVideo
// node getMovie.js task=movies limit=100 conditions=series:松本いちか series=松本いちか type=starVideo

