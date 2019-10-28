
const { seriesSchema } = require('./models/series')
const { movieSchema } = require('./models/movie')
const { getLists } = require('./html/series')
const { getHtml } = require('./html/movie')
const { init } = require('./template')


init({
  urls: 'https://avmask.com/cn/label/0ad807cf7302c623',
  gethtml: getLists,
  filePath: 'D:/md/avmoo',
  model: seriesSchema
})


// 开车
async function getSeries() {
  // await movieSchema.findOneAndRemove({ av: 'OFJE-086' })
  const data = await seriesSchema.find({ driven: 1 }).limit(30)
  const urls = data.map((item) => item.url)
  init({
    urls,
    gethtml: getHtml,
    filePath: 'D:/md/avmoo',
    model: movieSchema
  })
  return urls
}

// getSeries()