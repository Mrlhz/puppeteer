const path = require('path')

const c = require('ansi-colors')

const { proxyServer } = require('../../config/ip')
const { wait, writeFile, exists } = require('../../helper/tools')
const { Browser } = require('../../helper/browser')
const { getMovieDetailsHtml } = require('./html/getMovieDetailsHtml')

/**
 * @description 获取豆瓣电影简介 e.g. `https://movie.douban.com/subject/1307914/`
 *
 * @param {Array} urls 导航的地址
 * @param {Object} [options={}]
 * @todo 效率低，豆瓣IP限制
 */
async function getMovieDetails(urls, options = {}) {
  console.time('time')
  const { delay = 3000, type = '类型', name = '', output = __dirname } = options
  const fileName = handleFileName(type, output, name)
  const len = urls.length
  let items = []
  const instance = new Browser({
    // args: [proxyServer]
  })

  for (let i = 0; i < len; i++) {
    const page = await instance.goto(urls[i]) // 'proxy'
    console.log('title', await page.title())
    let click = await page.$('.more-actor') // 更多主演
    if(click) await page.click('.more-actor')
    try {
      const item = await getMovieDetailsHtml(page)
      if(item.errMsg) {
        console.log(c.yellowBright(item.errMsg))
        continue
      }
      items.push(item)
      haveOneSave(item, i, output)
      console.log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
    } catch (e) {
      console.log(e)
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
  writeFile(fileName + '.json', result, {
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
  writeFile(name + '-m.json', item, {
    output: path.resolve(output, 'temp')
  })
}


function handleFileName(type, output, name) {
  let fileName = name ? name : type + '-details'
  const p = path.join(output, fileName + '.json')
  if (exists(p)) {
    fileName = fileName + Date.now()
  }
  return fileName
}


module.exports = {
  getMovieDetails
}

// 内容需要展开 e.g.
// https://movie.douban.com/subject/1292052/
// https://movie.douban.com/subject/1297518/
