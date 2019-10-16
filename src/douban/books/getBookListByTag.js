const process = require('process')

const c = require('ansi-colors')

const { wait, writeFile } = require('../../helper/tools')
const { books_mdn_data } = require('../../config/index')
const { formatUrls } = require('../../helper/urls')
const { Browser } = require('../../helper/browser')
const { getBookListByTagHtml } = require('./html/getBookListByTag')

const bookBrief = require('../../models/bookBrief')
const bookTags = require('../../models/bookTags')
const { db } = require('../../mongo/db') // TODO 统一管理MongoDB
const log = console.log

/**
 * @description 获取豆瓣图书简介 e.g. `https://book.douban.com/tag/编程?start=0&type=T`，调取一次获取一页数据（20条）
 * @param {Array} urls
 * @param {Object} [options={}]
 */
async function getBookListByTag(urls, options = {}) {
  const { delay = 3000, tag = '文学', type = 'T' } = options
  const len = urls.length
  const result = []
  let stop = len // 50
  const instance = new Browser()
  for (let i = 0; i < len; i++) {
    const page = await instance.goto(urls[i])
    if (urls[i].indexOf('start=0') !== -1) {
      stop = await getPaginator(page, len)
      log(stop, 'stop')
    }
    try {
      const items = await getBookListByTagHtml(page)
      if(items.errMsg) {
        log(c.yellowBright(items.errMsg))
        break
      }

      for (let index = 0; index < items.length; index++) {
        const item = items[index]
        const book = await bookBrief.findOne({id: item.id })
        if (!book) {
          if (!item.tag) item.tag = [] 
          item.tag.push(tag)
          const res = await new bookBrief(item).save()
          log(`${c.green('insert success:')} ${res.title} ${res.id} ${res.rating}`)
        } else {
          log(`${c.red('fail')}: ${item.title}(${item.id}) existed`)
          if (book.tag.indexOf(tag) === -1) {
            book.tag.push(tag)
            await bookBrief.updateOne({ id: item.id }, { $set: { tag: book.tag } }, (err, docs) => {
              if (err) log(err)
            })
          }
        }
      }

      result.push(...items)
      log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
      if (stop === i + 1) {
        log(c.yellowBright('pages end')) // 判断页数提前停止
        await bookTags.findOneAndUpdate( { tag }, { [type]: 0 } )
        break
      }
    } catch (e) {
      log(c.red(e))
    }
    if (i !== len - 1) await wait(delay)
    await page.close()
  }
  
  await instance.close()
  return result
}

async function getPaginator(page, n=50) {
  const pages = await page.$$eval('.paginator a', nodes => Array.from(nodes).map((a) => a.innerText))
  const len  = pages.length
  if (len > 0) {
    const target = Number(pages[len - 2]) // ["2", "3", "4", "5", "6", "7", "8", "9", "73", "74", "后页>"] => 74
    return target > n ? n : target
  }
  return n // pages === [] e.g. `https://book.douban.com/tag/程序`没有页码
}

function saveFile(list, options) {
  const { tag, typeName, output = books_mdn_data } = options
  const data = {
    name: tag,
    type: typeName,
    total: list.length,
    subjects: list
  }

  writeFile({
    fileName: tag + '-simple.json',
    data,
    output
  })
}

module.exports = {
  getBookListByTag
}

/**
 * `测试`
 */
async function index(urlParams = {}, options = {}) {
  const { conditions, limit = 1, typeName } = options
  const list = await bookTags.find(conditions).limit(limit)

  const len = list.length
  for (let i = 0; i < len; i++) {
    const tag = list[i].tag
    const urls = formatUrls('https://book.douban.com/tag/%s?start=%s&type=%s', { tag, ...urlParams })
    log(urls)
    const result = await getBookListByTag(urls, {
      delay: 3000,
      tag,
      ...urlParams
    })
    if (result.length) {
      saveFile(result, { tag, typeName })
      await wait(6000)
    } else {
      break
    }
  }
  process.exit(0)
}

const typeNames = {
  T: '综合排序',
  R: '按出版日期排序',
  S: '按评价排序'
}
const type = ['T', 'R', 'S'][0]
const urlParams = {
  type
}

const options = {
  conditions: { T: 1 }, // { T: 1, tag: '历史' }
  typeName: typeNames[type],
  limit: 50
}

index(urlParams, options)
