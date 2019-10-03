const path = require('path')

const c = require('ansi-colors')

const { proxyServer } = require('../../config/ip')
const { wait, writeFile } = require('../../helper/tools')
const { Browser } = require('../../helper/browser')
const { getBookDetailsHtml } = require('./html//getBookDetailsHtml')

/**
 * @description 获取豆瓣图书简介 e.g. `https://book.douban.com/subject/27028517/`
 *
 * @param {Array} urls 导航的地址
 * @param {Object} [options={}]
 * @todo 效率低，豆瓣IP限制
 */
async function getBookDetails(urls, options = {}) {
  console.time('time')
  const { delay = 3000, type = '类型', name = '', output = __dirname } = options
  const fileName = name ? name : 'books-' + type
  const len = urls.length
  let items = []
  const instance = new Browser({
    // args: [proxyServer]
  })

  for (let i = 0; i < len; i++) {
    const page = await instance.goto(urls[i]) // 'proxy'
    console.log('title', await page.title())
    let click = await page.$('.j.a_show_full') // 内容简介 展开全部
    if(click) await page.click('.j.a_show_full')
    try {
      const item = await getBookDetailsHtml(page)
      if(item.errMsg) {
        console.log(c.yellowBright(item.errMsg))
        break
      }
      items.push(item)
      haveOneSave(item, i, output)
      console.log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
    } catch (e) {
      console.log(`${c.bgGreen('fail')} ${(i + 1)}/${len}`)
    }
    if (len > 1) await wait(delay)
    await page.close()
  }

  const result = {
    type,
    total: items.length,
    subjects: items
  }
  writeFile({
    fileName: fileName + '.json',
    data: result,
    output
  })
  
  await instance.close()
  console.timeEnd('time')
}

/**
 * @description 临时存文件
 * @param {String} item 内容
 * @param {String} name 文件名
 * @param {String} output 存放路径
 */
function haveOneSave(item, name, output) {
  writeFile({
    fileName: name + '-b.json',
    data: item,
    output: path.resolve(output, 'temp')
  })
}


module.exports = {
  getBookDetails
}

// 内容简介需要展开 e.g.
// https://book.douban.com/subject/1446625/
// https://book.douban.com/subject/27028517/
