const fs = require('fs')
const path = require('path')
const download = require('download')
const c = require('ansi-colors')

const { connect } = require('../src/mongo/db')
const { seriesSchema } = require('./models/series')
const { movieSchema, starVideoSchema } = require('./models/javbus')
const { wait, mkdirSync, exists  } = require('../src/helper/tools')
const publicDirectory = 'D:/md/avmoo'
const origin = 'https://www.busjav.blog'


const db = connect('javbus')

function formatUrl(url) {
  return url.includes('http') ? url : origin + url
}

async function init(params, options) {
  const { series = '', type = 'starVideo' } = options
  const seriesOutput = path.resolve(publicDirectory, series)
  mkdirSync(seriesOutput) // 创建 演员 || 系列目录
  const data = await queryMovie(params, options)
  // console.log(data, data[0])
  const { list, JAVIdol, JAVIdols } = findStar(data, series)
  console.log('data: ', data.length)
  console.log('list: ', list.length)
  console.log('JAVIdol: ', JAVIdol.length)
  console.log('JAVIdols: ', JAVIdols.length)
  // await downloadImage(JAVIdol, { ...options, seriesOutput })
  // if (JAVIdols.length) {
  //   const JAVIdolsOuput = path.resolve(publicDirectory, `合集作品-JAVIdols`)
  //   mkdirSync(JAVIdolsOuput)
  //   await downloadImage(JAVIdols, { ...options, seriesOutput: JAVIdolsOuput })
  // }
  if (JAVIdols.length) {
    const JAVIdolsOuput = path.resolve(publicDirectory, `合集作品-JAVIdols`)
    mkdirSync(JAVIdolsOuput)
    await Promise.all([downloadImage(JAVIdol, { ...options, seriesOutput }), downloadImage(JAVIdols, { ...options, seriesOutput: JAVIdolsOuput })])
  } else {
    await downloadImage(JAVIdol, { ...options, seriesOutput })
  }
}

async function queryMovie(params, options) {
  const schema = options.type === 'starVideo' ? starVideoSchema : movieSchema
  const res = await schema.find(params)
  // const res = await starVideoSchema.find(params)
  // const res = await movieSchema.find({ 'star.name': { $in: ['初愛ねんね'] } })
  // const res = await movieSchema.find({ star: { $elemMatch: { $eq: { name: '初愛ねんね' } } } })
  console.log(res.length)
  return res.slice(0)
}

async function downloadImage(data = [], options = {}) {
  const { seriesOutput, all = true } = options
  const allImagesPromise = []
  const allImages = []
  for (let index = 0; index < data.length; index++) {
    const { av, images } = data[index]
    console.log(av)
    const fulterImages= images.filter(item => {
      const imagePath = path.resolve(seriesOutput, av, item.name)
      return !exists(imagePath)
    })
    const output = path.resolve(seriesOutput, av)
    exists(output) ? '目录已存在' : mkdirSync(output) // 创建作品目录

    const imagesPromise = fulterImages.map(item => {
      return download(formatUrl(item.url), output, { filename: item.name })
    })
    if (all) {
      allImagesPromise.push(...imagesPromise)
    } else {
      const res = await Promise.allSettled(imagesPromise)
      console.log('res', res.map(item => item.status))
      imagesPromise.length && await wait(5000)
    }
    allImages.push(...images)
  }

  console.log('total picture: ', allImages.length)
  const allSettledPromise = all && await Promise.allSettled(allImagesPromise)
  console.log(allSettledPromise.length, allImagesPromise.length, allImages.length)
  return 0
}

function findStar(data = [], idols) {
  const JAVIdols = [] // 多位演员
  const JAVIdol = []  // 一位演员
  data.forEach(item => {
    if (item.star.length === 1) {
      JAVIdol.push(item)
    } else {
      JAVIdols.push(item)
    }
  })
  const list = data.filter(item => item.star.length === 1)
  return { list, JAVIdol, JAVIdols }
}


// 查询演员 star.name || idols都可以
// init({ 'star.name': '月乃ルナ' }, { series: '月乃ルナ', all: true })
// init({ 'idols': '橋本ありな' }, { series: '橋本ありな', all: true })
// init({ 'idols': '辻本杏' }, { series: '辻本杏', all: true })
// init({ 'idols': '鈴木心春' }, { series: '鈴木心春' })
// init({ 'idols': '私、実は夫の上司に犯●れ続けてます…' }, { series: '私、実は夫の上司に犯●れ続けてます…', type: 'movie' })
// init({ 'idols': '水卜さくら' }, { series: '水卜さくら', type: 'starVideo' })
// init({ 'idols': '永野いち夏' }, { series: '永野いち夏', type: 'starVideo' })
// init({ 'idols': '架乃ゆら' }, { series: '架乃ゆら', type: 'starVideo' })
// init({ 'idols': 'さくらゆら' }, { series: 'さくらゆら', type: 'starVideo' })
// init({ 'idols': '松本いちか' }, { series: '松本いちか', type: 'starVideo' }) // todo
// init({ 'idols': '鈴村あいり' }, { series: '鈴村あいり', type: 'starVideo' })
init({ 'idols': '明里つむぎ' }, { series: '明里つむぎ' })
