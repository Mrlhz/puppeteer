const path = require('path')
const util = require('util')

const c = require('ansi-colors')

const { saveImage, wait, mkdirSync, exists,writeFile } = require('./tools')


const output = 'D:/Yui Aragaki/末永みゆ'

// https://www.meitulu.com/t/miyu-suenaga/
// e.g. https://mtl.gzhuibei.com/images/img/9910/1.jpg
function makeList(start=1, end=30, format) {
  const baseUrl = 'https://mtl.gzhuibei.com/images/img/'
  let list = []
  for (let i = start; i <= end; i++) {
    list.push(`${baseUrl}${format}/${i}.jpg`)
  }
  return list
}


function wrapList(list=[], dir='') {
  const name = (url) => {
    const start = url.lastIndexOf('/')
    return url.substring(start + 1)
  }
  
  return list.map((item) => {
    return {
      name: name(item),
      dir,
      url: item
    }
  })
}

const { items } = require('./末永みゆ.json')
function generatorList(list=[], name=Date.now()) {
  const result = []
  for (const item of list) {
    let urls = makeList(1, item.p, item.url)
    let dir = mkdirSync(path.resolve(output, item.dir))
    urls = wrapList(urls, dir)
    result.push(...urls)
  }

  writeFile({
    fileName: name + '.json',
    data: result,
    output: __dirname
  })
  return result
}

/**
 * @description 输入图片url数组下载图片
 * @param {array} [list=[]]
 * @param {string} dir
 */
async function index(list=[], dir) {
  let len = list.length
  let index = 1
  for (const item of list) {
    if (exists(path.resolve(item.dir, item.name))) {
      console.log('exists', item.url)
    } else {
      await saveImage(item.url, item.dir, item.name.split('.')[0])
      console.log(c.bgGreenBright(`${index++} / ${len}`))
      await wait(1500)
    }
  }
}

// let list = wrapList(makeList(1, 30, '9910'))
index(generatorList(items))

