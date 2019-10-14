const c = require('ansi-colors')
const mongoose = require('mongoose')

const doubanDb = 'mongodb://localhost/douban'
const movie = require('../models/movie')
const movieBrief = require('../models/movieBrief')
const bookBrief = require('../models/bookBrief')
const tvBrief = require('../models/tvBrief')

const log = console.log

mongoose.set('useFindAndModify', false) // https://mongoosejs.com/docs/deprecations.html

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

function callback(err, doc) {
  if (err) log(err)
}

async function insertOne(model, list) {
  const m = await model.findOne({ id: list.id })
  if (m) {
    log(`${c.red('fail')}: ${list.title}(${list.id}) existed`)
  } else {
    const res = await new model(list).save()
    log(c.green('insert success:'), res.title, res.rating)
  }
}

async function updateOneById(id, update) {
  const conditions = { id }
  log('conditions:', conditions)
  // const update = { $set: { driven: 0 } }
  const res = await movieBrief.findOneAndUpdate(conditions, update, callback)
  log(res)
}

async function find(model, params, callback) {
  return await model.find(params, callback)
}

module.exports = {
  insertOne,
  updateOneById,
  callback,
  find
}
