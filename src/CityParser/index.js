const c = require('ansi-colors')

const { Browser } = require('../helper/browser')
const { wait } = require('../helper/tools')
const { getAreaHtml } = require('./getAreaHtml')
const City = require('../models/city/city')

const log = console.log

function connect(dbName) {
  const mongoose = require('mongoose')

  const doubanDb = 'mongodb://localhost/' + dbName

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
}

async function insert(model, list) {
  list = list.map((item) => setData(model, item))
  async function setData(model, item) {
    const m = await model.findOne({ id: item.id })
    if (m) {
      log(`${c.red('fail')}: ${item.name}(${item.id}) existed`)
      return m
    } else {
      const res = await new model(item).save()
      log(c.green('insert success:'), res.name, res.id)
      return res
    }
  }

  return Promise.all(list)
}

async function filter() {
  // 值不为null且存在的记录
  const list = await City.find({ todo: 1, url: { $ne:null, $exists: true } })
  return list
}

/**
 * @description 过滤一遍url，与数据库对比，已爬取的url不再发送请求
 * @param {Array} todoList 
 */
async function check(todoList) {
  const todoListUrls = todoList.map((item) => item.url)
  const unfinished = await City.find({ todo: 1, url: { $in: todoListUrls }}) // todo 为0的urls
  const unfinisheList = unfinished.map((item) => item.url)
  const list = todoList.filter((item) => unfinisheList.includes(item.url))
  return list
}

async function findPidList() {}

async function todo(url) {
  return await City.findOneAndUpdate({ url }, { $set: { todo: 0 } })
}

/**
 * @description 
 * @param {Array} list
 * @returns
 * @todo 
 */
async function getArea(list) {
  const result = []
  const browser = new Browser({})
  let i = 1
  const len = list.length
  for (const item of list) {
    const page = await browser.goto(item.url)
    try {
      let arr = await getAreaHtml(page) // should return array
      if (Array.isArray(arr)) {
        result.push(...arr)

        await insert(City, arr)
        await todo(item.url) // 成功访问的url todo值 => 0
      } else if (arr.errMsg) {
        log(c.bgRed(arr.errMsg))
        continue
      }

      log(`${c.bgGreen('done')} ${i++} / ${len}`)
    } catch (e) {
      console.error(e)
    }

    await wait(3500)
    await page.close()
  }

  await browser.close()

  return result
}

/**
 * @description 获取 `2018年统计用区划代码和城乡划分代码`
 * @see http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/index.html
 * @param {Array} list
 */
async function index(list) {
  const queue = []
  queue.push(list)
  let names = ['city', 'county', 'town', 'village']
  for (let i = 0; i < names.length; i++) {
    let cur = queue.shift()
    // 过滤
    cur = await check(cur)
    let item = await getArea(cur)

    queue.push(item)
  }

}

const pca = require('@area/province.min.json')
let target = pca.filter((item) => item.name === '北京市')

async function run() {
  // 连接数据库
  await connect('city')

  await index(target)
  const list = await filter()
  await getArea(list)
  // await City.updateMany({ todo: 0 })

  process.exit(0)
}

const bj = require('./data/北京市.json')
log(bj.length)
// run()s
