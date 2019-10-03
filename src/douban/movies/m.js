const path = require('path')

const puppeteer = require('puppeteer')
const c = require('ansi-colors')

const { sleep, writeFile, serializedParams, formatTime } = require('../../helper/tools')
const { temp } = require('../../config/index')

/**
 * @description 保存豆瓣影视json
 *
 * @param {String} urlPath
 * @param {Object} options
 */
async function fetchSubjects(urlPath, options) {
  let {
    fileName = Date.now(), count = 20, timestamps = 3000, sort = 'S', range = '8,10', tags = '', start = 0, countries = ''
  } = options
  const len = count / 20
  let result = []

  const browser = await puppeteer.launch()

  for (let i = 0; i < len; i++) {
    let params = {
      sort,
      range,
      tags,
      countries,
      start: i * 20 + start
    }
    const url = serializedParams(urlPath, params)
    const page = await browser.newPage()
    await page.goto(url)

    // start +=20
    console.log(c.bgGreenBright('fetch') + ' ' + c.green.bold(url))

    let list = await page.evaluate(() => {
      const pre = document.querySelector('body pre')
      return pre.innerHTML
    })

    try {
      list = JSON.parse(list)
      console.log(c.cyan(formatTime()) + ' ' + c.red('items') + ': ' + list.data.length)

      if (list.data.length === 0) {
        break
      }

      list.data.forEach((item) => {
        result.push(item)
      })
    } catch (e) {
      console.log(c.red(e))
    }

    await page.close()

    if (i > 20) {
      await sleep(5000)
    } else {
      await sleep(timestamps)
    }

  }

  fileName = name('json', {
    sort,
    range,
    tags,
    countries,
    start: `[${start},${start + result.length}]`
  })
  console.log(c.bold.red('result') + ': ' + c.bold.yellow(result.length) + '')
  writeFile({
    fileName,
    data: result,
    output: temp
  })

  await browser.close()
}



let params = {
  href: 'https://movie.douban.com/j/new_search_subjects',
  sort: 'S', // 近期热门 U 标记最多 T 评分最高 S 最新上映 R
  range: '8,10', // 0,10
  tags: '电影', // 电影,电视剧,综艺,动漫,纪录片,短片
  start: 0,
  countries: '' // 中国大陆,美国,中国香港,中国台湾,日本,韩国,英国,法国,德国,意大利,西班牙,印度,泰国,俄罗斯,伊朗,加拿大,澳大利亚,爱尔兰,瑞典,巴西,丹麦
}


/**
 * @description 文件命名
 *
 * @param {String} type
 * @param {Object} options
 * @returns
 * @example
 * name('json', {tags: '电影', start: 0, range: '8,10'})
 * // tags=电影&start=0&range=8,10.json
 */
function name(type, options) {
  let params = []
  for (let [key, value] of Object.entries(options)) {
    if (value === void 0) value = ''
    params.push(`${key}=${value}`)
  }
  return params.join('&') + '.' + type
}

// let url = 'https://movie.douban.com/j/new_search_subjects?sort=S&range=7,10&tags=电视剧&start=60&countries=日本'

// 3680
fetchSubjects('https://movie.douban.com/j/new_search_subjects', {
  count: 20,
  start: 0,
  sort: 'S',
  range: '9,10',
  tags: '电影',
  countries: '',
  timestamps: 3000
})
