const process = require('process')
const path = require('path')
const fs = require('fs')

const c = require('ansi-colors')
const publicDirectory = 'D:/md/avmoo'
const origin = 'https://www.busjav.blog'

const { Browser } = require('../src/helper/browser')
const { wait, saveImage, getLocation, mkdirSync, exists, downloadImage  } = require('../src/helper/tools')
const { getHtml } = require('./html/movie')
const { connect } = require('../src/mongo/db')
const { seriesSchema } = require('./models/series')
const { movieSchema } = require('./models/javbus')
const log = console.log


const db = connect('javbus')

// 查询
async function queryMovie() {
  const res = await movieSchema.find({ 'star.name': '初愛ねんね' })
  // const res = await movieSchema.find({ 'star.name': { $in: ['初愛ねんね'] } })
  // const res = await movieSchema.find({ star: { $elemMatch: { $eq: { name: '初愛ねんね' } } } })
  // const res = await movieSchema.find({})
  console.log(res, res.length)
  return res.slice(6, 7)
}

async function handle(data = []) {
  // for (let index = 0; index < data.length; index++) {
  //   const { av, images } = data[index]
  //   console.log(av)
  //   const task = [...images]

  //   const tasks = task.map(image => {
  //     const output = path.resolve(publicDirectory, av)
  //     exists(output) ? output : mkdirSync(output)
  //     const url = image.url.includes('http') ? image.url : origin + image.url
  //     return downloadImage(url, output, image.name)
  //   })
  //   await wait(5000)
  //   await Promise.all(tasks)
  //   await wait(5000)
  // }

  // for (let index = 0; index < data.length; index++) {
  //   const { av, images } = data[index]
  //   console.log(av)
  //   const task = [...images]
  //   while(task.length) {
  //     const image = task.pop()
  //     try {
  //       const output = path.resolve(publicDirectory, av)
  //       const url = image.url.includes('http') ? image.url : origin + image.url
  //       // console.log(url, output, image.name)
  //       exists(output) ? output : mkdirSync(output)
  //       // saveImage(url, output, image.name)
  //       await downloadImage(url, output, image.name)
  //       // task.push(saveImage(url, output, image.name))
  //       await wait(500)
  //     } catch (error) {
  //       console.log(error)
  //       task.unshift(image)
  //       await wait(5000)
  //     }
  //   }
  // }

  // ---------------------------循环方式3----------------------------------
  for (let index = 0; index < data.length; index++) {
    const { av, images } = data[index]
    console.log(av)
    const task = [...images]
    for (let index = 4; index < task.length; index++) {
      const image = task[index]
      try {
        const output = path.resolve(publicDirectory, av)
        const url = image.url.includes('http') ? image.url : origin + image.url
        // console.log(url, output, image.name)
        exists(output) ? output : mkdirSync(output)
        // saveImage(url, output, image.name)
        const res = await downloadImage(url, output, image.name)
        console.log(res)
        // task.push(saveImage(url, output, image.name))
        await wait(500)
      } catch (error) {
        console.log(error)
        await wait(5000)
      }
    }
  }
  // --------------------------------------------------------------
}

async function index() {
  let data = await queryMovie()
  await handle(data)
  process.exit(0)
}

index()

// process.exit(0)

/**
 * @description 输入图片url数组下载图片
 * @param {array} [list=[]]
 * @param {number} delay
 */
 async function download(list=[], delay=100) {
  list = filter(list)
  let len = list.length
  let idx = 1
  for (const item of list) {
    await saveImage(item.url, item.dir, item.name.split('.')[0])
    console.log(c.bgGreenBright(`${idx++} / ${len}`))
    await wait(delay)
  }
}


