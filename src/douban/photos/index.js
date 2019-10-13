const fs = require('fs')
const path = require('path')
const utils = require('util')

const c = require('ansi-colors')
const sharp = require('D:/web/puppeteer/node_modules/sharp')

const { Browser } = require('../../helper/browser')
const { wait, writeFile, saveImage, isImage, readDirFiles, mkdirSync, exists } = require('../../helper/tools')
const log = console.log

const output = 'D:/Yui Aragaki'

/**
 * @description 获取豆瓣影人图片
 * @param {object} options
 */
async function getCelebrityPhotos({ urls=[], name }) {
  const items = []
  const len = urls.length
  const browser = new Browser({})
  for (let i = 0; i < len; i++) {
    const page = await browser.goto(urls[i])
    try {
      const item = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.article .cover img')).map((item) => {
          const src = item.getAttribute('src')
          const start = src.lastIndexOf('/')
          const end = src.lastIndexOf('.')
          return {
            name: src ? src.substring(start + 1, end) : Date.now(),
            url: src ? src.replace('/m/', '/l/') : '',
            m: src
          }
        })
      })

      items.push(...item)
      log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
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
  await browser.close()
  return result
}

// https://movie.douban.com/celebrity/1275733/photos/?type=C&start=0&sortby=like&size=a&subtype=a
function getCelebrityPhotoUrls({ celebrityId, end }) {
  // sortby 按喜欢排序like · 按尺寸排序size · 按时间排序time
  const url = 'https://movie.douban.com/celebrity/%s/photos/?type=C&start=%s&sortby=like&size=a&subtype=a'
  const urls = []
  for (let i = 0; i < end; i++) {
    urls.push(utils.format(url, celebrityId, i * 30))
  }
  return urls
}

async function getPicture(list, dir = __dirname) {
  const len = list.length
  for (let i = 0; i < len; i++) {
    // const url = list[i].url.replace('ps.jpg', 'pl.jpg')
    // const dir = list[i].dir
    const url = list[i].url
    const name = list[i].name
    await saveImage(url, dir, name)
    log(`done: ${i + 1}/${len}`)
    await wait(500)
  }
}

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
  let { input, output, ext = 'png' } = options
  const files = await readDirFiles(input)
  output = exists(output) ? output : mkdirSync(output)

  files.forEach( (file) => {
    if (isImage(file)) {
      const { name } = path.parse(file)
      const pic = path.join(output, `${name}.${ext}`)

      sharp(`${input}/${file}`)
        .toFile(pic, (err, info) => {
          if (err) console.log(err)
        })
    }

    // A Promise is returned
    // sharp(`${input}/${file}`)
    // .toFile(`${output}/${name}.${ext}`)
    // .then( (info) => { console.log(info.size); })
    // .catch( (err) => { console.log(err); });

  })
}

/**
 * 1. get picture src
 * 2. download image
 * 3. image webp convert to jpg || png
 */
async function index(options={}) {
  const { name, celebrityId, end, immediately = false, delay = 3000 } = options
  let dir = path.join(output, name)
  let webp = path.join(dir, 'webp')
  dir = exists(dir) ? dir : mkdirSync(dir)
  webp = exists(webp) ? webp : mkdirSync(webp)

  const urls = getCelebrityPhotoUrls({ celebrityId, end })
  const data = await getCelebrityPhotos({ urls, name })
  writeFile({fileName: name + '.json', data, output: dir})

  if (immediately) {
    await wait(delay)
    getPicture(data.items, webp) // 2.
  }
}

// 1.
index({
  name: '新垣结衣 Yui Aragaki',
  celebrityId: '1018562',
  end: 69,
  immediately: true,
  delay: 1500
})

// 2. 
// const { items } = require(path.join(output, '桥本爱 Ai Hashimoto', '桥本爱 Ai Hashimoto.json'))
// getPicture(items, path.join(output, '桥本爱 Ai Hashimoto'))

// 3.
// convertImage({
//   input: 'D:/Yui Aragaki/桥本爱 Ai Hashimoto/webp',
//   output: 'D:/Yui Aragaki/桥本爱 Ai Hashimoto/pics',
//   ext: 'jpg'
// })
