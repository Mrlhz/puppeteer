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
  const { delay = 3000, tag = '文学', type = 'T', typeName = '综合排序' } = options
  let stop = 50
  const len = urls.length
  let items = []
  const instance = new Browser()
  for (let i = 0; i < len; i++) {
    const page = await instance.goto(urls[i])
    try {
      const { item, pages } = await getBookListByTagHtml(page)
      if (pages) stop = pages
      if(item.errMsg) {
        log(c.yellowBright(item.errMsg))
        break
      }

      for (let index = 0; index < item.length; index++) {
        const element = item[index]
        const book = await bookBrief.findOne({id: element.id })
        if (!book) {
          if (!element.tag) element.tag = [] 
          element.tag.push(tag)
          const res = await new bookBrief(element).save()
          log(`${c.green('insert success:')} ${res.title} ${res.id} ${res.rating}`)
        } else {
          log(`${c.red('fail')}: ${element.title}(${element.id}) existed`)
          if (book.tag.indexOf(tag) === -1) {
            book.tag.push(tag)
            await bookBrief.findOneAndUpdate({ id: element.id }, { $set: { tag: book.tag } }, (err, docs) => {
              if (err) log(err)
            })
          }
        }
      }

      items.push(...item)
      log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
      // 判断页数提前停止
      if (stop === i + 1) {
        log(c.yellowBright('pages end'))
        break
      }
    } catch (e) {
      log(c.red(e))
    }
    if (i !== len - 1) await wait(delay)
    await page.close()
  }

  await bookTags.findOneAndUpdate( { tag }, { [type]: 0 } )

  const result = {
    name: tag,
    type: typeName,
    total: items.length,
    subjects: items
  }

  writeFile({
    fileName: tag + '-simple.json',
    data: result,
    output: books_mdn_data
  })
  
  await instance.close()
}

module.exports = {
  getBookListByTag
}

/**
 * `测试`
 */
async function index(params={}) {
  const { conditions, limit = 1, type, typeName } = params
  const list = await bookTags.find(conditions).limit(limit)

  const len = list.length
  for (let i = 0; i < len; i++) {
    const tag = list[i].tag
    const urls = formatUrls('https://book.douban.com/tag/%s?start=%s&type=%s', {
      tag,
      start: 0,
      end: 980,
      increase: 20,
      type
    })
    log(urls)
    await getBookListByTag(urls, {
      delay: 1000,
      tag,
      type,
      typeName
    })
    await wait(6000)
  }
  process.exit(0)
}

const typeNames = {
  T: '综合排序',
  R: '按出版日期排序',
  S: '按评价排序'
}
const types = ['T', 'R', 'S']
const type = types[0]


index({
  conditions: { T : 1 }, // { T: 1, tag: '历史' } { tag: '编程' }
  type,
  typeName: typeNames[type],
  limit: 50
})

