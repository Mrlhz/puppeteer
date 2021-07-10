const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const request = require('request')


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
  // output为空时默认存放路径为 data  D:/.../puppeteer/data
  let { fileName = '未命名' + Date.now(), data = '', output = '.', encoding = 'utf8' } = options
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
 * // https://movie.douban.com/j/new_search_subjects?start=0&sort=S&range=6,10&tags=电影&countries=中国大陆
 * // https://movie.douban.com/j/new_search_subjects?sort=S&range=0,10&tags=电影&start=0&countries=中国香港&year_range=1990,1999
 */
function serializedParams(url, options = {}) {
  let params = []
  for (let [key, value] of Object.entries(options)) {
    if (value || value === 0) {
      params.push(`${key}=${value}`)
    }
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
 * @description 创建文件夹，返回文件夹绝对路径
 * @param {String} pathName  A path to a file. If a URL is provided, it must use the file: protocol.
 * @returns {String} path
 */
function mkdirSync(pathName) {
  if (fs.existsSync(pathName)) {
    log('dir ' + pathName + ' exist')
    return pathName
  }
  fs.mkdirSync(pathName)
  log('mkdir '+ pathName +' success')
  return pathName
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
function saveImage(url, dir, fileName=Date.now()) {
  if (isImage(url)) {
    const mod = /^https:/.test(url) ? https: http
    const ext = path.extname(url) || '.webp'
    const { name } = path.parse(fileName)
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

function downloadImage(url, dir, fileName=Date.now()) {
  return new Promise(resolve => {
    if (isImage(url)) {
      const ext = path.extname(url) || '.webp'
      const { name } = path.parse(fileName)
      const file = path.join(dir, `${name}${ext}`)
      log(`${c.bgGreen('fetch')} ${url}`)
      // request({url}).pipe(
      //   fs.createWriteStream(file).on('close', (err) => {
      //     log(file, 'finish')
      //     err && log(err, 'err')
      //     resolve('finish')
      //   })
      // )

      const writeStream = fs.createWriteStream(file, { autoClose: true })
      request({url}).pipe(writeStream)
      writeStream.on('finish', (err) => {
        log(file, 'finish')
        err && log(err, 'err')
        // writeStream.end() // autoClose为false 时可以使用
        resolve('finish')
      })
    }
  })
}



function isImage(url) {
  return /\.(jpg|png|gif|jpeg|webp)$/.test(url)
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

  if (strLen !== n) {
    const template = '0'.repeat(32)
    return template.substring(0, n - strLen) + str
  }
  return str
}

/**
 * @description 获取一个字符串URL的域名，主域等信息
 * @param {*} url
 * @returns
 */
function getLocation(url) {
  // if (url) {
  //   let aDom = document.createElement('a')
  //   aDom.href = url
  //   let obj = {
  //     hostname: aDom.hostname,
  //     host: aDom.host,
  //     origin: aDom.origin,
  //     protocol: aDom.protocol,
  //     pathname: aDom.pathname,
  //     hash: aDom.hash
  //   }
  //   const re = /([a-z0-9][a-z0-9\-]*?\.(?:com\.cn|net\.cn|org\.cn|com\.au|imipo\.shop|com|cn|co|net|org|gov|cc|biz|info|hn|xyz|hk|icu|us|mobi|art|wang|me|so|top|win|vip|ltd|red|ru|ac\.cn|xn--kput3i|xin|xn--3ds443g|shop|site|club|fun|online|link|gov\.cn|name|pro|work|tv|kim|group|tech|store|cx|ren|ink|pub|live|wiki|design|xn--fiq228c5hs|xn--6qq986b3xl|xn--fiqs8s|xn--ses554g|xn--hxt814e|xn--55qx5d|xn--io0a7i|xn--3bst00m)(?:\.(?:cn|jp))?)$/
  //   let Domain = obj.hostname.match(re)
  //   if (Domain) {
  //     obj.domain = Domain[0]
  //   }
  //   return obj
  // }
  if (URL) {
    return new URL(url)
  }
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
  isImage,
  padzeros,
  getLocation,
  downloadImage
}
