const c = require('ansi-colors')

const { wait } = require('../../helper/tools')
const { Browser } = require('../../helper/browser')
const { temp } = require('../../config/index')

const Brief = require('../../models/brief')
const { insertOne } = require('../../mongo/index')

const log = console.log


async function getBriefMovieInfo(params={}) {
  console.time('time')
  const { urls = [], output = '.', delay = 3000 } = params

  const items = []
  const browser = new Browser()
  for (let i = 0; i < urls.length; i++) {
    const page = await browser.goto(urls[i])
    try {
      const { data } = await page.evaluate(() => {
        const pre = document.querySelector('body pre')
        return JSON.parse(pre.innerHTML)
      })
      if (data.length === 0) break
      for (let j = 0; j < data.length; j++) {
        items.push(data[j])
        await insertOne(Brief, data[j])
      }
    } catch (e) {
      log(c.red(e))
    }
    await wait(delay)
    await page.close()
  }
  log(c.bgGreen(items.length))
  await browser.close()
  console.timeEnd('time')
}

// https://movie.douban.com/j/new_search_subjects?sort=S&range=0,10&tags=&start=2720&countries=中国香港&year_range=1990,1999

function serializedParams(url, options = {}) {
  let params = []
  for (let [key, value] of Object.entries(options)) {
    if (value || value===0) {
      params.push(`${key}=${value}`)
    }
  }

  return url + '?' + params.join('&')
}


function makeUrls(params={}) {
  const { start=0, end=3000 } = params
  const urls = []
  for (let i = start; i < end; i+=20) {
    const url = serializedParams('https://movie.douban.com/j/new_search_subjects', {
      start: i,
      sort: 'S',
      range: '0,10',
      tags: '电影',
      countries: '中国香港',
      year_range: '1990,1999'
    })

    urls.push(url)
  }
  return urls
}

const urls = makeUrls({end: 3000})

console.log(urls);
getBriefMovieInfo({
  urls
})