const mongoose = require('mongoose')

const doubanDb = 'mongodb://localhost/douban'
const Movie = require('../models/movie')

const log = console.log

mongoose.connect(doubanDb, {
  useNewUrlParser: true
}, () => log('mongodb connect success'))


// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise
// 取得默认连接
const db = mongoose.connection

// 将连接与错误事件绑定（以获得连接错误的提示）
db.on('error', console.error.bind(console, 'MongoDB 连接错误：'))
