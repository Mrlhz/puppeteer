const process = require('process')

const { connect } = require('../src/mongo/db')
const { seriesSchema, idolsSchema } = require('./models/series')
const { movieSchema } = require('./models/javbus')
const { getOne, getLists } = require('./html/javbus')
const { init } = require('./template')

const log = console.log

const db = connect('javbus')

async function getSeries(options) {
  init({
    gethtml: getLists,
    task: 'series',
    ...options
  })
}

var p = {
  urls: 'https://avmask.com/cn/star/7096b13b9ea2d654',
  gethtml: getLists,
  series: '永野いち夏',
  task: 'series',
  filePath: 'D:/md/avmoo',
  print: true
}


// 开车 将文档series中的作品集合简略信息，遍历存到movies文档中
async function getMovies(options, conditions={ driven: 1 }) {
  const { limit = 30, origin, type } = options
  const schema = type === 'starVideo' ? idolsSchema : seriesSchema
  const data = await schema.find(conditions).limit(limit)
  // let urls = data.map((item) => item.url)
  // urls = origin ? urls.map((url) => setOrigin(url)) : urls
  origin ? data.forEach(item => item.url = setOrigin(item.url)) : ''
  init({
    // urls,
    dataInfo: data,
    gethtml: getOne,
    task: 'movies',
    ...options
  })
  return data
}

function getUrlList(origin = []) {
  return origin.reduce((acc, cur) => {
    const name = cur.split('.')
    const domain1 = name[1]
    const domain2 = name.slice(1).join('.')
    if (!acc[domain1]) {
      acc[domain1] = cur
    } else {
      acc[domain2] = cur
    }
    return acc
  }, {})
}

function setOrigin(oldUrl='', name='busjav') {
  let re = /^https?:\/\/[\w.]+\/([a-zA-Z0-9-]+)$/i // e.g. https://www.javbus.cc/[IPZ-931]
  const origin = [
    'https://www.fanbus.bid',
    'https://www.busfan.pw',
    'https://www.busfan.in',
    'https://www.busfan.cloud',
    'https://www.fanbus.us',
    'https://www.fanbus.icu',

    'https://www.seedmm.work',
    'https://www.dmmbus.work',
    'https://www.cdnbus.work',
    'https://www.busdmm.work',
    'https://www.dmmsee.bid',
    'https://www.fanbus.cc',
    'https://www.busfan.cc',
    'https://www.busjav.blog',
    'https://www.javbus.com',
    'https://www.busfan.bar',
    'https://www.buscdn.xyz',
    'https://www.javbus.bar'
  ]
  const urls = getUrlList(origin)
  const start = oldUrl.lastIndexOf('/')
  const av = oldUrl.substring(start)
  return urls[name] + av
}

let conditions = {}
const params = process.argv.slice(2).reduce((acc, cur) => {
  let [key, value] = cur.split('=')
  if (key === 'conditions') {
    const [k, v] = value.split(':')
    conditions[k] = v
  } else {
    !Number.isNaN(Number(value)) ? value = Number(value) : value
    acc[key] = value
  }
  return acc
}, {})

const options = {
  task: 'series',
  filePath: 'D:/md/avmoo',
  print: false,
  origin: true, // 更改url origin
  showall: false, // 全部影片
  type: 'series', // 默认数据库集合
  ...params
}

log(options, conditions)

if (options.task === 'series') {
  getSeries(options)
} else if (options.task === 'movies') {
  Object.keys(conditions).length > 0 ? getMovies({ type: 'movie', ...options }, conditions): getMovies(options)
}

// process.exit(0)

// series 已有磁力
// node index.js urls=https://avmask.com/cn/star/9c786fb6e8c34746 series=河北彩花
// node index.js urls=https://www.busjav.blog/star/sl1 series=河北彩花 showall=true
// node index.js urls=https://www.busjav.blog/series/1dj series=夫の目の前で犯されて
// node index.js urls=https://www.busjav.blog/star/pmv series=橋本ありな type=idols
// node index.js urls=https://www.busjav.blog/star/ufk series=月乃ルナ type=idols
// node index.js urls=https://www.busjav.blog/star/b6a series=辻本杏 type=idols
// node index.js urls=https://www.busjav.blog/star/b6a series=MOODYZFresh showall=true

// movies
// node index.js task=movies limit=25
// node index.js task=movies limit=25 conditions=av:[番号]
// node index.js task=movies limit=1 conditions=series:初愛ねんね series=初愛ねんね
// node index.js task=movies limit=1 conditions=series:河北彩花 series=河北彩花
// node index.js task=movies limit=100 conditions=series:橋本ありな series=橋本ありな type=starVideo
// node index.js task=movies limit=100 conditions=series:月乃ルナ series=月乃ルナ type=starVideo
// node index.js task=movies limit=100 conditions=series:辻本杏 series=辻本杏 type=starVideo
