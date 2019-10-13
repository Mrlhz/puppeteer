const path = require('path')

const puppeteer = require('puppeteer')
const c = require('ansi-colors')

const { executablePath } = require('../../config/index')
const { wait, writeFile, saveImage, readDirFiles, mkdirSync } = require('../../helper/tools')
const log = console.log

/**
 * @description 获取豆瓣影人图片
 * @param {object} options
 */
async function getCelebrityPhotos(options = {}) {
  const { urls, name, output = __dirname } = options
  const items = []
  const browser = await puppeteer.launch({ headless: false, executablePath })
  const len = urls.length
  for (let i = 0; i < len; i++) {
    const page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 1080 })
    await page.goto(urls[i])
    try {
      const item = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.article .cover img')).map((item) => {
          const src = item.getAttribute('src')
          const start = src.lastIndexOf('/')
          const end = src.lastIndexOf('.')
          return {
            name: src ? src.substring(start + 1, end) : Date.now(),
            url: src
          }
        })
      })

      items.push(...item)
    } catch (e) {
      log(c.red(e))
    }

    if ( i !== len - 1) await wait(3000)
    await page.close()
  }

  const result = {
    name,
    total: items.length,
    items
  }
  writeFile(name + '.json', result, {
    output
  })
  await browser.close()
}


const utils = require('util')
// https://movie.douban.com/celebrity/1031173/photos/?type=C&start=0&sortby=like&size=a&subtype=a
function getCelebrityPhotoUrls(options = {}) {
  const { url, end } = options
  const urls = []
  for (let i = 0; i < end; i++) {
    urls.push(utils.format(url, i * 30))
  }
  return urls
}

// [ 'https://movie.douban.com/celebrity/1031173/photos/?type=C&start=0&sortby=like&size=a&subtype=a',
//   'https://movie.douban.com/celebrity/1031173/photos/?type=C&start=30&sortby=like&size=a&subtype=a',
//   'https://movie.douban.com/celebrity/1031173/photos/?type=C&start=60&sortby=like&size=a&subtype=a',
//   'https://movie.douban.com/celebrity/1031173/photos/?type=C&start=90&sortby=like&size=a&subtype=a',
//   'https://movie.douban.com/celebrity/1031173/photos/?type=C&start=120&sortby=like&size=a&subtype=a' ]

const urls = getCelebrityPhotoUrls({url: 'https://movie.douban.com/celebrity/1031173/photos/?type=C&start=%s&sortby=like&size=a&subtype=a', end: 5})
// getCelebrityPhotos({
//   urls,
//   name: '平野绫 Aya Hirano'
// })

const { items } = require('./平野绫 Aya Hirano.json')

const output = 'D:\\Yui Aragaki\\平野绫 Aya Hirano'


async function getPicture(list, dir = __dirname) {
  const len = list.length
  for (let i = 0; i < len; i++) {
    // const url = list[i].url.replace('/m/', '/l/')
    const url = list[i].url.replace('ps.jpg', 'pl.jpg')

    // const dir = list[i].dir
    const name = list[i].name
    await saveImage(url, dir, name)
    log(`done: ${i + 1}/${len}`)
    await wait(500)
  }
}

// getPicture(items, output)

/**
 * @description 图片格式转化
 * @see https://sharp.pixelplumbing.com/en/stable/api-input/
 *
 * @param {String} input  输入文件夹路径
 * @param {String} output 输出文件夹路径
 * @param {string} [ext='jpg'] JPEG, PNG, WebP, TIFF, DZI
 * @returns
 */
async function convertImage(options = {}) {
  const { input, output, ext = 'png' } = options

  const files = await readDirFiles(input)

  files.forEach(function (file) {

    var name = file.split('.')[0] || 
    sharp(`${input}/${file}`)
      .toFile(`${output}/${name}.${ext}`, async function (err, info) {
        if (err) console.log(err)
        result.push(info)
      })

    // A Promise is returned
    // sharp(`${input}/${file}`)
    // .toFile(`${output}/${name}.${ext}`)
    // .then( (info) => { console.log(info.size); })
    // .catch( (err) => { console.log(err); });

  })
}

// convertImage({
//   input: 'D:\\Yui Aragaki\\平野绫',
//   output: 'D:\\Yui Aragaki\\平野绫 Aya Hirano',
// })
