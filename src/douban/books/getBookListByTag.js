const process = require('process')

const c = require('ansi-colors')

const { wait, writeFile } = require('../../helper/tools')
const { books_mdn_data } = require('../../config/index')
const { formatUrls } = require('../../helper/urls')
const { Browser } = require('../../helper/browser')
const { getBookListByTagHtml } = require('./html/getBookListByTag')

const bookBrief = require('../../models/bookBrief')
const bookTags = require('../../models/bookTags')
const { insertOne, updateOne } = require('../../mongo/index')

/**
 * @description 获取豆瓣图书简介 e.g. `https://book.douban.com/tag/编程?start=0&type=T`，调取一次获取一页数据（20条）
 * @param {Array} urls
 * @param {Object} [options={}]
 */
async function getBookListByTag(urls, options = {}) {
  const { delay = 3000, tag = '', type = '', typeName = '综合排序' } = options
  const len = urls.length
  let items = []
  const instance = new Browser()
  console.log(c.cyanBright(tag))
  let count = 0
  for (let i = 0; i < len; i++) {
    const page = await instance.goto(urls[i])
    try {
      const item = await getBookListByTagHtml(page)
      if(item.errMsg) {
        console.log(c.yellowBright(item.errMsg))
        break
      }

      for (let index = 0; index < item.length; index++) {
        const element = item[index]
        const book = await bookBrief.findOne({id: element.id })
        if (!book) {
          if (!element.tag) element.tag = [] 
          element.tag.push(tag)
          const res = await new bookBrief(element).save()
          console.log(res)
        } else {
          count++
          console.log(`${c.red('fail')}: ${element.title}(${element.id}) existed`)
          if (book.tag.indexOf(tag) === -1) {
            book.tag.push(tag)
            await bookBrief.findOneAndUpdate({ id: element.id }, { $set: { tag: book.tag } }, (err, docs) => {
              if (err) console.log(err)
            })
          }
          // await bookBrief.updateOne({ id: element.id }, { $push: { tag: tag } }, (err, docs) => {
          //   if (err) console.log(err)
          //   console.log(1)
          // })
        }
      }

      items.push(...item)
      console.log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
    } catch (e) {
      console.log(c.red(e))
    }
    if (i !== len - 1) await wait(delay)
    await page.close()
  }

  const sort = {
    [type]: { value: typeName, driven: true }
  }
  console.log(sort)
  await updateOne(bookTags, { tag }, { driven: 0, sort })

  console.log(count)

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
const types = ['T', 'R', 'S'] // type[综合排序 T  |  按出版日期排序 R |  按评价排序 S]
const typeNames = {
  T: '综合排序',
  R: '按出版日期排序',
  S: '按评价排序'
}
const type = types[2]

async function index(conditions, limit=1) {
  const list = await bookTags.find(conditions).limit(limit)

  const len = list.length
  for (let i = 0; i < list.length; i++) {
    const tag = list[i].tag
    const urls = formatUrls('https://book.douban.com/tag/%s?start=%s&type=%s', {
      tag,
      start: 0,
      end: 980,
      increase: 20,
      type
    })
    console.log(urls)
    await getBookListByTag(urls, {
      delay: 3500,
      tag,
      type,
      typeName: typeNames[type]
    })
  }
  console.log(len)
  process.exit(0)
}

// index({ driven: 1 })
index({ tag: '外国名著' })

