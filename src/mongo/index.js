const c = require('ansi-colors')
const mongoose = require('mongoose')

const doubanDb = 'mongodb://localhost/douban'
const Movie = require('../models/movie')
const movieBrief = require('../models/movieBrief')
const bookBrief = require('../models/bookBrief')
const tvBrief = require('../models/tvBrief')

const log = console.log

mongoose.connect(doubanDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => log('mongodb connect success'))


// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise
// 取得默认连接
const db = mongoose.connection

// 将连接与错误事件绑定（以获得连接错误的提示）
db.on('error', console.error.bind(console, 'MongoDB 连接错误：'))


async function insertMany(filePath, modal) {
  const { subjects } = require(filePath)
  subjects.forEach((item) => {
    if (!item.id) {
      item.id = Number(item.url.match(/\/(\d+)\//)[1])
    }
  })
  await modal.insertMany(subjects, function (err, docs) {
    if (err) {
      console.error(err);
    }
    console.log('insertMany', docs.length);
  })

}

// insertMany('D:/books/mdn/data/book-simple/外国名著-simple.json', bookBrief)

async function insert(files, modal) {

  for (let i = 0; i < files.length; i++) {
    const { subjects } = require('D:/web/myblog/puppeteer/data/tv/min/' + files[i] + '.min.json')
      await modal.insertMany(subjects, (err, docs) => {
        if (err) console.error(err)
        log('success:', docs.length)
    })
  }
}

// insert(["热门", "美剧", "英剧", "韩剧", "日剧", "国产剧", "港剧", "日本动画", "综艺", "纪录片"], tvBrief)

async function insertOne(modal, list) {
  const m = await modal.findOne({ id: list.id })
  if (m) {
    // console.log(m);
    log(`${c.red('fail')}: ${list.title}(${list.id}) existed`)
  } else {
    const res = await new modal(list).save()
    log(c.green('insert success:'), res.title)
  }
}

async function remove(params) {
  const res = await Movie.remove(params)
  log('remove success', res)
}

async function getMovie(params) {
  let m = await Movie.find({
    // 'countries': ['中国大陆','香港']
    // 'countries': {$in: ['中国大陆','香港']},
    // 'rating_people': {$gt:5000},
    'id': 1291546
  }, '', function (err, list) {
    if (err) {
      // return handleError(err);
      console.log(err);
    }
    // console.log(list.length);
  })
  log(m.length)
  log(m)
}

// getMovie()
// remove({ id: 1307739 })


module.exports = {
  insertOne
}