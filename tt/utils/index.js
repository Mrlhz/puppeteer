
const path = require('path')
const process = require('process')
const c = require('ansi-colors')
const log = console.log

function getUrlList(origin = []) {
  return origin.reduce((acc, cur) => {
    const name = cur.split('.')
    const domain1 = name[1]
    const domain2 = name.slice(1).join('.')
    if (!acc[domain1]) {
      acc[domain1] = cur
    } else {
      acc[domain2] = cur
    }
    return acc
  }, {})
}

function setOrigin(oldUrl='', name='busjav') {
  let re = /^https?:\/\/[\w.]+\/([a-zA-Z0-9-]+)$/i // e.g. https://www.javbus.cc/[IPZ-931]
  const origin = [
    'https://www.fanbus.bid',
    'https://www.busfan.pw',
    'https://www.busfan.in',
    'https://www.busfan.cloud',
    'https://www.fanbus.us',
    'https://www.fanbus.icu',

    'https://www.seedmm.work',
    'https://www.dmmbus.work',
    'https://www.cdnbus.work',
    'https://www.busdmm.work',
    'https://www.dmmsee.bid',
    'https://www.fanbus.cc',
    'https://www.busfan.cc',
    'https://www.busjav.blog',
    'https://www.javbus.com',
    'https://www.busfan.bar',
    'https://www.buscdn.xyz',
    'https://www.javbus.bar'
  ]
  const urls = getUrlList(origin)
  const start = oldUrl.lastIndexOf('/')
  const av = oldUrl.substring(start)
  return urls[name] + av
}

async function isMovieExist(model, movieInfo) {
  let isExist = false
  const m = await model.findOne({ av: movieInfo.av })
  if (m) {
    log(`${c.red('fail')}: ${movieInfo.title}(${movieInfo.av}) existed`)
    isExist = true
  }
  return { isExist }
}

async function showAll(page, showall) {
  if (showall && page.$('#resultshowall')) {
    const resultshowall = page.$('#resultshowall')
    resultshowall ? page.click('#resultshowall') : ''
  }
}

async function screenshot(pdfParams) {
  const { page, filePath } = pdfParams
  const { pagination } = await page.evaluate(() => {
    document.querySelectorAll('.ad-table').forEach((ad) => {
      ad.style.display = 'none' // 隐藏广告
    })
    let pagination = document.querySelector('.pagination .active')
    pagination = pagination ? pagination.innerText : '' // 当前页面
    return { pagination }
  })

  let title = await page.title()
  title = pagination ? `${title}-page-${pagination}` : title

  await page.screenshot({
    path: path.resolve(filePath, `${title}.png`), // todo
    fullPage: true
  })
}

function filterVR(data) {
  const vrs = []
  const list = []
  data.forEach((item) => {
    item.title.indexOf('【VR】') === -1 ? list.push(item) : vrs.push(item)
  })

  log(vrs, 'ignore')
  return list
}

function getInputParams() {
  let conditions = {}
  const params = process.argv.slice(2).reduce((acc, cur) => {
    let [key, value] = cur.split('=')
    if (key === 'conditions') {
      const [k, v] = value.split(':')
      conditions[k] = v
    } else {
      !Number.isNaN(Number(value)) ? value = Number(value) : value
      acc[key] = value
    }
    return acc
  }, {})
  return { params, conditions }
}


module.exports = {
  setOrigin,
  showAll,
  screenshot,
  filterVR,
  isMovieExist,
  getInputParams
}
