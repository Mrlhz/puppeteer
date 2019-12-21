const c = require('ansi-colors')

const { Browser } = require('../helper/browser')
const { wait } = require('../helper/tools')
const { getAreaHtml } = require('./getAreaHtml')
const { connect } = require('../mongo/db')
const City = require('../models/city/city')

const log = console.log

async function insert(model, list) {
  list = list.map((item) => setData(model, item))
  async function setData(model, item) {
    const m = await model.findOne({ id: item.id })
    if (m) {
      log(`${c.red('fail')}: ${item.name}(${item.id ? item.id : ''}) existed`)
      return m
    } else {
      const res = await new model(item).save()
      log(c.green('insert success:'), res.name, res.id)
      return res
    }
  }

  return Promise.all(list)
}

async function filterList() {
  // 值不为''且存在的记录
  const list = await City.find({ todo: 1, url: { $ne:'', $exists: true } })
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
  if (list.length === 0) return todoList
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
async function getArea(list, options={}) {
  let { msg = '', delay = 3500 } = options
  const result = []
  const browser = new Browser({})
  let i = 1
  list = list.filter((item) => item.url)
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
      log(`${c.bgGreen('done')} ${i++} / ${len} ${c.greenBright(msg)}`)
    } catch (e) {
      console.error(e)
    }

    if (i > 1 || i < len) await wait(delay)
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
    // cur = await check(cur) // bug
    let item = await getArea(cur, { msg: names[i] })

    queue.push(item)
  }

}

const pca = require('@area/province.min.json')
let target = pca.filter((item) => item.code === '45')

async function run() {
  // 连接数据库
  
  await connect('city')
  console.time('time')
  await index(target)
  console.timeEnd('time')

  // ----

  console.time('filter time')
  const list = await filterList()
  await getArea(list)
  console.timeEnd('filter time')
  process.exit(0)

  // await City.updateMany({ todo: 0 })
}

run()
