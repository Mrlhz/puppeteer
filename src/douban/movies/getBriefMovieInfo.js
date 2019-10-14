const util = require('util')
const process = require('process')

const c = require('ansi-colors')

const { wait, serializedParams } = require('../../helper/tools')
const { Browser } = require('../../helper/browser')

const movieBrief = require('../../models/movieBrief')
const { insertOne } = require('../../mongo/index')

const log = console.log

async function getBriefMovieInfo(params = {}) {
  console.time('time')
  const { urls = [], delay = 3000 } = params

  const items = []
  const len = urls.length
  const browser = new Browser()
  for (let i = 0; i < len; i++) {
    const page = await browser.goto(urls[i])
    try {
      const item = await page.evaluate(() => {
        const pre = document.querySelector('body pre')
        if (pre) {
          return JSON.parse(pre.innerHTML)
        } else {
          // errMsg.indexOf('检测到有异常请求') !== -1
          return { errMsg: document.querySelector('body').innerText }
        }
      })
      if (item.errMsg) break
      const { data } = item
      if (data.length === 0) break
      for (let j = 0; j < data.length; j++) {
        const movie = data[j]
        if (typeof movie.rate === 'string') {
          movie.rate = Number(movie.rate)
        }
        items.push(movie)
        await insertOne(movieBrief, movie)
      }
      log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
    } catch (e) {
      log(c.red(e))
    }
    if (i !== len - 1) await wait(delay)
    await page.close()
  }
  log(c.bgGreen(items.length))
  await browser.close()
  console.timeEnd('time')
  process.exit(0)
}

// https://movie.douban.com/j/new_search_subjects?sort=S&range=0,10&tags=&start=2720&countries=中国香港&year_range=1990,1999


function makeUrls(params = {}) {
  console.time('time')
  const { start = 0, end = 3000, sort = 'S', range = '0,10', tags = '电影', genres = '', countries = '', year_range = '' } = params
  const urls = []
  for (let i = start; i < end; i += 20) {
    // urls.push(util.format('https://movie.douban.com/j/new_search_subjects?start=%s&sort=%s&range=%s&tags=%s&countries=%s&year_range=%s', i, sort, range, tags, countries, year_range))
    const url = serializedParams('https://movie.douban.com/j/new_search_subjects', {
      start: i,
      sort,
      range,
      tags,
      genres,
      countries,
      year_range
    })
    urls.push(url)
  }
  console.timeEnd('time')
  return urls
}

const urls = makeUrls({
  start: 0,
  end: 3000, // 6520
  // sort: 'U',
  range: '8,9',
  tags: '电影',
  // genres: '喜剧',
  // countries: '法国',
  // year_range: '1990,1999' // 1,1959  | 2010,2019 |2019,2019
})

getBriefMovieInfo({
  delay: 5000,
  urls
})
