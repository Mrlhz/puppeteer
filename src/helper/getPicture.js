const path = require('path')
const util = require('util')

const c = require('ansi-colors')

const { saveImage, wait, mkdirSync, exists,writeFile } = require('./tools')

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

function generatorList(list=[], output, name=Date.now()) {
  const result = []
  for (const item of list) {
    let urls = makeList(1, item.p, item.url)
    let dir = mkdirSync(path.resolve(output, item.dir))
    urls = wrapList(urls, dir)
    result.push(...urls)
  }

  if (!exists(path.resolve(__dirname, name + '.json'))) {
    writeFile({
      fileName: name + '.json',
      data: result,
      output: __dirname
    })
  }
  return result
}

function filter(list=[]) {
  return list.filter((item) => {
    return !exists(path.resolve(item.dir, item.name))
  })
}

/**
 * @description 输入图片url数组下载图片
 * @param {array} [list=[]]
 * @param {number} delay
 */
async function index(list=[], delay=100) {
  list = filter(list)
  let len = list.length
  let idx = 1
  for (const item of list) {
    await saveImage(item.url, item.dir, item.name.split('.')[0])
    console.log(c.bgGreenBright(`${idx++} / ${len}`))
    await wait(delay)
  }
}

// let list = wrapList(makeList(1, 30, '9910'))

function run(file, baseDir='D:/Yui Aragaki') {
  const output = mkdirSync(path.resolve(baseDir, file)) // e.g. D:/Yui Aragaki/森萝财团
  const { items } = require(`./${file}.json`) // e.g. require('./末永みゆ.json')
  // http://xinsijitv78.top/tag/森萝财团.html

  let genList = generatorList(items, output, `[${file}]pics`)

  let n = items.reduce((acc, cur) => {
    acc += cur.p
    return acc
  }, 0)
  console.log(n)

  // const list = require(`./[${file}]pics.json`)
  index(genList, 100)
}
// run('森萝财团')
run('桜桃喵')