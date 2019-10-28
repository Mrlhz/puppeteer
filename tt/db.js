const process = require('process')

const mongoose = require('mongoose')
const c = require('ansi-colors')

const doubanDb = 'mongodb://localhost/bt'
const btbook = require('./models/bt')

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


async function save(data = {}) {
  const hash = await btbook.findOne({ hash: data.hash })
  if (!hash) {
    const res = await new btbook(obj).save()
    console.log(c.bgGreen('insert'), res)
  } else {
    console.log(c.bgRed('exist'), hash)
  }

  process.exit(0)
}

const magnet = 'magnet:?xt=urn:btih:6E9D96EF83B708774E11C35FCE0BC56B3E62B064'
// const obj = {
//   title: '91秦先生全部作品21部全集',
//   info: '91秦先生全部作品21部全集',
//   magnet,
//   hash: magnet.split(':')[3],
//   stars: [{
//     name: '91秦先生',
//     url: ''
//   }],
//   type: ['91秦先生', '91'],
//   images: ['']
// }

// save(obj)

module.exports = {
  db
}