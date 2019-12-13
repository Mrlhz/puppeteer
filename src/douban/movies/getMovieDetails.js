const c = require('ansi-colors')

const { proxyServer } = require('../../config/ip')
const { wait } = require('../../helper/tools')
const { Browser } = require('../../helper/browser')
const { getMovieDetailsHtml } = require('./html/getMovieDetailsHtml')
const movie = require('../../models/movie')
const { insertOne, updateOneById } = require('../../mongo/index')
const { showAll } = require('../util')

/**
 * @description 获取豆瓣电影简介 e.g. `https://movie.douban.com/subject/1307914/`
 *
 * @param {Array} urls 导航的地址
 * @param {Object} [options={}]
 * @todo 效率低，豆瓣IP限制, 登陆验证码
 */
async function getMovieDetails(urls, options = {}) {
  console.time('time')
  const { delay = 3000 } = options
  const len = urls.length
  const instance = new Browser({
    // args: [proxyServer]
  })

  const items = []
  for (let i = 0; i < len; i++) {
    const page = await instance.goto(urls[i]) // 'proxy'
    // console.log('title', await page.title())
    await showAll(page, ['.more-actor', '.j.a_show_full']) // 展开内容
    try {
      const item = await getMovieDetailsHtml(page)
      if (item.doesNotExist) {
        await updateOneById(item.id, { $set: { valid: false } })
        console.log(c.yellowBright(item.doesNotExist)) // e.g. 页面不存在 条目不存在
        continue
      }
      if (item.errMsg) {
        console.log(c.yellowBright(item.errMsg))
        break
      }
      const res = await insertOne(movie, item)
      if (res) await updateOneById(item.id, { $set: { driven: 0 } })
      items.push(item)
      console.log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
    } catch (e) {
      console.log(e)
    }
    if (len > 1 && i !== len -1) await wait(delay)
    await page.close()
  }

  await instance.close()
  console.timeEnd('time')
  return items
}

module.exports = {
  getMovieDetails
}

// 内容需要展开 e.g.
// https://movie.douban.com/subject/1292052/
// https://movie.douban.com/subject/1297518/
