const c = require('ansi-colors')

const { Browser } = require('../../helper/browser')
const { writeFile, wait } = require('../../helper/tools')
const { movie_dir } = require('../../config/index')

const { getMovieTop250Html } = require('./html/getMovieTop250Html')

const log = console.log

/**
 * @description `https://movie.douban.com/top250?start=0&filter=`
 * @param {Object} options
 */
async function getTop250List(options) {
  const { title, urls } = options
  const browser = new Browser()
  const items = []
  const len = urls.length
  for (let i = 0; i < len; i++) {
    const page = await browser.goto(urls[i])
    await wait(3000)
    try {
      const item = await getMovieTop250Html(page)
      items.push(...item)
      log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
    } catch (e) {
      log(c.red(e))
    }
    await page.close()
  }

  const result = {
    title,
    total: items.length,
    subject: items
  }

  writeFile({
    fileName: title + '.json',
    data: result,
    output: movie_dir
  })
  await browser.close()
}

function makeUrls(url) {
  const urls = []
  for (let i = 0; i < 250; i += 25) {
    urls.push('https://movie.douban.com/top250?start='+ i +'&filter=')
  }
  return urls
}

const urls = makeUrls('https://movie.douban.com/top250?start=%s&filter=')

// getTop250List({
//   title: '豆瓣电影 Top 250',
//   urls
// })