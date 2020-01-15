const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')

const c = require('ansi-colors')

async function sleep (delay, timestamp = 1000, msg=true) {
  return new Promise(resolve => {
    if (msg) {
      console.log(c.red(`wait ${timestamp/1000} seconds`))
    }
    setTimeout(resolve, delay)
  })
}

function exists(path) {
  return fs.existsSync(path)
}

function isImage(url) {
  return /\.(jpg|png|gif|jpeg|webp)$/.test(url)
}

function otherMatch(url) {
  return /huabanimg/.test(url)
}

function saveImage(url, dir, name=Date.now()) {
  if (isImage(url) || otherMatch(url)) {
    const mod = /^https:/.test(url) ? https: http
    const file = path.join(dir, name)
    console.log(`${c.bgGreen('fetch')} ${url}`)

    mod.get(url, (res)=> {
      res.pipe(fs.createWriteStream(file))
        .on('finish', () => {
          console.log(file)
        })
    })
  }
}

function mkdirSync(pathLike, options={}) {
  if (fs.existsSync(pathLike)) return
  fs.mkdirSync(pathLike, options)
}

/**
 * @description
 * @param {Array} [list=[]]
 * @example
 * ['https://hbimg.huabanimg.com/c98928b291843da03501efb38a4362149683868d41d47-izS7Wj_fw658'] => [{ url : '' }]
 */
function stringUrl2Object(list=[]) {
  return list.map((item) => {
    if (typeof item === 'string') {
      return { url: item }
    } else {
      return item
    }
  })
}

/**
 * @description 图片重命名, 创建目录
 * @param {Array} list
 * @param {Object} [options={}]
 * @returns
 */
function initParams(list, options = {}) {
  let { newName, dir = __dirname, maxLenght = 2, fillString = '0' } = options

  mkdirSync(dir, { recursive: true })

  list = list.map((item, index) => {
    let { name, ext } = path.parse(item.url)
    ext = ext ? ext : '.webp'
    return {
      url: item.url,
      name: `${ newName ? newName : name }-${(index + 1).toString().padStart(maxLenght, fillString)}${ext}`,
      dir
    }
  })
  return list
}

async function index(list = [], options = {}) {
  let { delay, skip = true } = options

  const length = list.length
  for (let i = 0; i < length; i++) {
    let item = list[i]

    if (skip && exists(path.join(item.dir, item.name))) continue // 存在跳过
    await saveImage(item.url, item.dir, item.name)
    await sleep(delay)
  }
}

async function run(list, options={}) {
  let name = options.newName
  list = stringUrl2Object(list)
  list = initParams(list, options)

  //for cover
  list = list.map((item) => {
    let { ext } = path.parse(item.url)
    if (item.url.includes('/cover/')) {
      item.name = name + ext
    }
    return item
  })

  await index(list, options)
}

let list = []

list = ['https://hbimg.huabanimg.com/23f812636359a615e84de2ca2259db9171c4aa38a2b0-0cnvpF_fw658']

run(list, { newName: '2919131932', dir: __dirname, delay: 100 })


// console.log(path.parse('https://hbimg.huabanimg.com/c98928b291843da03501efb38a4362149683868d41d47-izS7Wj_fw658'))


function allPics() {
  let screencap = document.querySelector('.screencap img')
  screencap = screencap ? screencap.getAttribute('src') : ''

  let list = Array.from(document.querySelectorAll('#sample-waterfall a.sample-box')).map((item) => {
    return item.getAttribute('href')
  })

  list.push(screencap)
  return list
}

