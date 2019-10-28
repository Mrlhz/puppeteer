const process = require('process')

const { db } = require('./db')
const { seriesSchema } = require('./models/series')
const { movieSchema } = require('./models/movie')
const { getLists } = require('./html/series')
const { getHtml } = require('./html/movie')
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
async function getMovies(options) {
  const { limit = 30 } = options
  const data = await seriesSchema.find({ driven: 1 }).limit(limit)
  const urls = data.map((item) => item.url)
  console.log(urls);
  init({
    urls,
    gethtml: getHtml,
    task: 'movies',
    ...options
  })
  return urls
}


const params = process.argv.slice(2).reduce((acc, cur) => {
  let [key, value] = cur.split('=')
  if (!Number.isNaN(Number(value))) {
    value = Number(value)
  }
  acc[key] = value
  return acc
}, {})

const options = {
  task: 'series',
  filePath: 'D:/md/avmoo',
  print: true,
  ...params
}

log(options)

if (options.task === 'series') {
  getSeries(options)
} else if (options.task === 'movies') {
  getMovies(options)
}

// process.exit(0)

// series
// node tt\index.js urls=https://avmask.com/cn/star/9c786fb6e8c34746 series=河北彩花

// movies
// node tt\index.js task=movies limit=25
