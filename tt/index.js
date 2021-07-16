const process = require('process')

const { connect } = require('../src/mongo/db')
const { seriesSchema, idolsSchema } = require('./models/series')
const { movieSchema } = require('./models/javbus')
const { getOne, getLists } = require('./html/javbus')
const { setOrigin, getInputParams } = require('./utils/index')
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

const { params, conditions } = getInputParams()

const options = {
  task: 'series',
  filePath: 'D:/md/avmoo',
  print: false,
  origin: true, // 更改url origin
  showall: false, // 全部影片
  type: '', // 默认数据库集合
  ...params
}


log(options, conditions)

if (options.task === 'series') {
  options.type = options.type || 'series'
  getSeries(options)
} else if (options.task === 'movies') {
  options.type = options.type || 'movie'
  Object.keys(conditions).length > 0 ? getMovies({ ...options }, conditions): getMovies(options)
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
// node index.js urls=https://www.busjav.blog/star/rul series=高杉麻里
// node index.js urls=https://www.busjav.blog/series/3q3 series=私、実は夫の上司に犯●れ続けてます…
// node index.js urls=https://www.busjav.blog/star/qs6 series=明里つむぎ
// node index.js urls=https://www.busjav.blog/star/1fw series=つぼみ
// node index.js urls=https://www.busjav.blog/star/vb3 series=松本いちか
// node index.js urls=https://www.busjav.blog/star/w5a series=乙白さやか type=idols
// node index.js urls=https://www.busjav.blog/star/t14 series=坂道みる
// node index.js urls=https://www.busjav.blog/star/ucw series=日泉舞香 type=idols

// movies
// node index.js task=movies limit=25
// node index.js task=movies limit=25 conditions=av:[番号]
// node index.js task=movies limit=1 conditions=series:初愛ねんね series=初愛ねんね
// node index.js task=movies limit=1 conditions=series:河北彩花 series=河北彩花
// node index.js task=movies limit=100 conditions=series:橋本ありな series=橋本ありな type=starVideo
// node index.js task=movies limit=100 conditions=series:月乃ルナ series=月乃ルナ type=starVideo
// node index.js task=movies limit=100 conditions=series:辻本杏 series=辻本杏 type=starVideo
// node index.js task=movies limit=100 conditions=series:叶恵みつは series=叶恵みつは type=starVideo
// node index.js task=movies limit=1000 conditions=series:私、実は夫の上司に犯●れ続けてます… series=私、実は夫の上司に犯●れ続けてます…
// node index.js task=movies limit=1000 conditions=series:明里つむぎ series=明里つむぎ
// node index.js task=movies limit=1000 conditions=series:高杉麻里 series=高杉麻里
// node index.js task=movies limit=1000 conditions=series:つぼみ series=つぼみ
// node index.js task=movies limit=1000 conditions=series:坂道みる series=坂道みる
// node index.js task=movies limit=1000 conditions=series:日泉舞香 series=日泉舞香 type=starVideo
// node index.js task=movies limit=1000 conditions=series:乙白さやか series=乙白さやか type=starVideo
