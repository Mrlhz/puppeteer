const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')

const c = require('ansi-colors')

const log = console.log

/**
 * @description 延迟
 * @param {Number} delay
 * @returns
 * @example
 * await sleep(3000) // 延迟3秒
 */
async function sleep (delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
}

/**
 * @description 延迟log
 * @param {Number} timestamp
 * @param {Number} t
 * @param {boolean} [log=true]
 */
async function wait(timestamp=3000, islog=true, t='') {
  if(islog) log(c.red(`Wait ${timestamp/1000} seconds`))
  if(t) log(t)
  await sleep(timestamp)
}

/**
 * @description 异步保存文件，文件已存在则替换
 * @param {Object} [options={fileName, data, output}] fileName, data, output, encoding
 * @returns
 */
function writeFile(options = {}) {
  let {
    fileName = '未命名' + Date.now(),
    data = '',
    output = '', // 为空时默认存放路径为 data  D:/.../puppeteer/data
    encoding = 'utf8'
  } = options
  // log('output', output)
  output = output ? path.resolve(output, fileName) : path.resolve(__dirname, '../../data', fileName)
  data = typeof data === 'string' ? data : JSON.stringify(data)
  
  // content = content.replace(/\n\r/gi, '').replace(/\n/gi, '').replace(/\r/gi, '')

  return new Promise((resolve, reject) => {
    fs.writeFile(output, data, encoding, err => {
      if (err) {
        log('写入失败', err)
        reject(err)
      } else {
        log(`写入成功 => ${output}`)
        resolve('success')
      }
    })
  })
}

/**
 * @description 异步地读取文件的全部内容
 * @param {String} fileName
 * @returns
 */
function readFile(fileName, { encoding = 'utf8' } = {}) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, { encoding}, function(error, data) {
      if (error) return reject(error)
      resolve(data)
    })
  })
}

/**
 * @description url拼接参数
 *
 * @param {String} url
 * @param {Object} [options={}]
 * @returns
 * @example
 * serializedParams('https://movie.douban.com/j/new_search_subjects', {
 * start: 0,
 * sort: 'S',
 * range: '6,10',
 * tags: '电影',
 * countries: '中国大陆'
 * })
 * // https://movie.douban.com/j/new_search_subjects?start=0&sort=S&range=6,10&tags=电影&countries=中国大陆
 */
function serializedParams(url, options = {}) {
  // let { sort='S', range='8,10', tags='', start=0, countries='' } = options
  
  // url = `${url}?sort=${sort}&range=${range}&tags=${tags}&start=${start}&countries=${countries}`

  let params = []
  for (let [key, value] of Object.entries(options)) {
    if (value === void 0) value = ''
    if (value === '') continue
    params.push(`${key}=${value}`)
  }

  return url + '?' + params.join('&')
}

/**
 * @description 时间
 * @param {Date} date
 * @returns
 * @example
 * formatTime()
 * // 2019-09-01 22:44:44
 */
function formatTime(date=new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * @description 创建文件，返回文件夹绝对路径
 * @param {String} dirName new dir name
 * @param {String} pathName  A path to a file. If a URL is provided, it must use the file: protocol.
 * @returns {String} path 
 */
function mkdirSync(dirName, pathName) {
  let output = path.resolve(pathName, dirName)
  if (fs.existsSync(output)) {
    log('dir ' + output + ' exist')
    return output
  }
  fs.mkdirSync(output)
  log('mkdir '+ output +' success')
  return output
}

/**
 * @description 读取目录的内容
 * @param { String | Buffer | URL } dir A path to a file. If a URL is provided, it must use the file:protocol.
 * @param { Object } [options={}] The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, 'utf8' is used.
 * @returns 
 */
function readDirFiles(dir, options={}) {
  let { withFileTypes = false, encoding = 'utf8' } = options
  return new Promise((resolve, reject) => {
    fs.readdir(dir, {withFileTypes, encoding},(err, files) => {
      if (err) reject(err)
      resolve(files)
    })
  })
}

/**
 * @description A path to a file or directory
 * @param {PathLike} path
 * @returns {Boolean}
 */
function exists(path) {
  return fs.existsSync(path)
}

function type(obj) {
  let typeStr = Object.prototype.toString.call(obj)
  let length = typeStr.length
  return typeStr.substring(8, length - 1)
}

/**
 * @description 保存已知url的images
 * @param {String} url 图片url
 * @param {String} dir 保存文件目录
 * @param {String|Number} [name=Date.now()] 文件名
 */
function saveImage(url, dir, name=Date.now()) {
  if ((/\.(jpg|png|gif|jpeg|webp)$/.test(url))) {
    const mod = /^https:/.test(url) ? https: http
    const ext = path.extname(url) || '.webp'
    const file = path.join(dir, `${name}${ext}`)
    log(`${c.bgGreen('fetch')} ${url}`)

    mod.get(url, (res)=> {
      res.pipe(fs.createWriteStream(file))
        .on('finish', () => {
          log(file)
        })
    })
  }
}

/**
 * @description 补零
 * @param {Number|String} input
 * @param {Number} n a number padded with zeros
 * @returns {String}
 * @example
 * padzeros(9, 4) // 0009
 */
function padzeros(input = '', n = 2) {
  const str = typeof input === 'string' ? input : input.toString()
  const strLen = str.length
  const template = '0'.repeat(32)

  if (strLen !== n) {
    return template.substring(0, n - strLen) + str
  }
  return str
}

module.exports = {
  sleep,
  wait,
  writeFile,
  readFile,
  serializedParams,
  formatTime,
  mkdirSync,
  readDirFiles,
  exists,
  saveImage,
  padzeros
}