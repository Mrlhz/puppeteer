const c = require('ansi-colors')
const { argv } = require('yargs')


const { Browser } = require('../helper/browser')
const { wait } = require('../helper/tools')
const { getAreaHtml } = require('./getAreaHtml')
const { connect } = require('../mongo/db')
const City = require('../models/city/city')
const Province = require('../models/city/province')
const { insert } = require('./util')

const log = console.log

/**
 * @description 查询字段url存在且不为''的列表记录
 */
async function unfinishedList() {
  const list = await City.find({ todo: 1, url: { $ne:'', $exists: true } })
  return list
}

async function findPidList() {}

/**
 * @description 爬取完毕的url todo值 => 0
 */
async function todo(url) {
  return await City.findOneAndUpdate({ url }, { $set: { todo: 0 } })
}

/**
 * @description 获取html城市信息，存入数据库
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
        await insert(City, arr, { id: 'id', name: 'name' })
        await todo(item.url) // 成功访问的url todo值 => 0
      } else if (arr.errMsg) {
        log(c.bgRed(arr.errMsg))
        continue
      }
      log(`${c.bgGreen('done')} ${i++} / ${len} ${c.greenBright(msg)}`)
    } catch (e) {
      console.error(e)
    }

    if (i > 2 && i < len) await wait(delay)
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
    let item = await getArea(cur, { msg: names[i] })

    queue.push(item)
  }

}

/**
 * @description 爬取完毕，修改省份todo值
 */
async function updateProvinceTodo(code) {
  const { length } = await City.find({ id: `/^${code}/`, todo: 1 })
  if (length === 0) {
    try {
      let res = await Province.findOneAndUpdate({ id: code }, { $set: { todo: 0 } })
      console.log(res)
      if (res) {
        console.log(`${res.name} complete`)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

async function finished(code) {
  const res = await Province.findOne({ code })
  return res
}

async function unfinished() {
  const res = await Province.findOne({ todo: 1 })
  return res
}

const pca = require('@area/province.min.json')

/**
 * @description
 * 0. 根据code选择一个未爬取的省份进行爬取, code：手动输入或者从Province中选择
 * 1. 先查询province 是否完成
 * 2. 如果查询有未爬取完成的list，爬取这些url，todo => 0
 * 3. 否则根据code值开始爬取新的省份数据
 *
 */
async function run() {
  // 连接数据库
  await connect('city')
  let code = argv.code
  if (!code) code = (await unfinished()).code
  code = code.toString()

  let p = await finished(code)
  if (p.todo === 0) {
    console.log(`${p.name} finished`)
    process.exit(0)
  }

  console.time('unfinished list time')

  // 有未爬取的urls
  let list = await unfinishedList()
  if (list.length) {
    let todolist = []
    todolist.push(list)
    while (todolist.length) {
      await getArea(todolist.shift())
      let tem =  await unfinishedList()
      if (tem.length === 0) {
        await updateProvinceTodo(code)
        break
      }
      todolist.push(tem)
    }
    console.timeEnd('unfinished list time')
  } else {
    // 开始爬取新的url
    let target = pca.filter((item) => item.code === code)
    console.time('time')
    await index(target)
    console.timeEnd('time')
  }

  process.exit(0)
}

run()
// e.g.
// node index.js
// or
// node index.js --code=11
