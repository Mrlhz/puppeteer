const process = require('process')

const { db } = require('./db')
const { seriesSchema } = require('./models/series')
const { movieSchema } = require('./models/javbus')
const { getLists } = require('./html/series')
const { getOne } = require('./html/javbus')
const { init } = require('./template')

const log = console.log

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


// 开车
async function getMovies(options, conditions={ driven: 1 }) {
  const { limit = 30 } = options
  const data = await seriesSchema.find(conditions).limit(limit)
  const urls = data.map((item) => item.url)
  console.log(urls);
  init({
    urls,
    gethtml: getOne,
    task: 'movies',
    ...options
  })
  return urls
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
  showall: false, // 全部影片
  ...params
}

log(options, conditions)

if (options.task === 'series') {
  getSeries(options)
} else if (options.task === 'movies') {
  Object.keys(conditions).length > 0 ? getMovies(options, conditions): getMovies(options)
}

// process.exit(0)

// series 已有磁力
// node tt\index.js urls=https://avmask.com/cn/star/9c786fb6e8c34746 series=河北彩花

// movies
// node index.js task=movies limit=25
// node index.js task=movies limit=25 conditions=av:[番号]
