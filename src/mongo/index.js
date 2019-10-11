const mongoose = require('mongoose')

const doubanDb = 'mongodb://localhost/douban'
const Movie = require('../models/movie')
const movieBrief = require('../models/movieBrief')

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


async function insertMany() {
  const { subjects } = require('D:/web/myblog/puppeteer/data/movie/top250.json')
  subjects.forEach((item) => {
    if (!item.top250) {
      item.top250 = 0
    }
  })
  await Movie.insertMany(subjects, function (err, docs) {
    if (err) {
      console.error(err);
    }
    console.log('insertMany', docs.length);
  })

}

// insertMany()
async function insert(movies=[]) {
  // const { subjects } = require('D:/web/myblog/puppeteer/data/movie/top250.json')

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i]
    const m = await Movie.findOne({ id: movie.id })
    if (!m) {
      const res = await new Movie(movie).save()
      log('success:', res.title)
    }
  }
}

async function insertOne(modal, list) {
  const m = await modal.findOne({ id: list.id })
  if (m) {
    console.log(m);
    log('fail:', list.id + ' existed')
  } else {
    const res = await new modal(list).save()
    log('insert success:', res.title)
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