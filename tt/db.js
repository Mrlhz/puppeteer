const mongoose = require('mongoose')

function connect(database) {
  if (mongoose.connection.readyState === 1) {
    console.log('connect success')
    return Promise.resolve(database)
  }
  if (!database) throw new Error('database can\'t be null or undefined')
  const connectDb = 'mongodb://localhost/' + database
  mongoose.set('useFindAndModify', false) // https://mongoosejs.com/docs/deprecations.html

  // 让 mongoose 使用全局 Promise 库
  mongoose.Promise = global.Promise

  // 取得默认连接
  const db = mongoose.connection

  // 将连接与错误事件绑定（以获得连接错误的提示）
  db.on('error', console.error.bind(console, 'MongoDB 连接错误：'))
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  return new Promise((resolve, reject) => {
    mongoose.connect(connectDb, options, () => {
      console.log('mongodb connect success: ' + database)
      resolve(db)
    }, err => {
      reject(err)
    })
  })
}

module.exports = {
  connect
}
