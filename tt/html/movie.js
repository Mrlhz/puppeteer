/**
 * @description 根据 `avmoo.asia` 网站编写，返回`一部作品`html内容
 *
 * @param {puppeteer.Page} page
 */
async function getHtml(page) {
  try {
    return await page.evaluate(() => {
      function getHtml() {
        // 1.
        const title = document.querySelector('.container h3')
        // 2.
        let screencap = document.querySelector('.screencap img')
        screencap = screencap ? screencap.getAttribute('src') : ''
        // 3.
        const star = Array.from(document.querySelectorAll('#avatar-waterfall .avatar-box')).map((item) => {
          return {
            name: item.innerText || '',
            url: item.getAttribute('href') || ''
          }
        })
        // 4.
        const images = Array.from(document.querySelectorAll('#sample-waterfall a.sample-box')).map((item) => {
          const url = item.getAttribute('href') // https://jp.netcdn.space/digital/video/41hrdv00591/41hrdv00591jp-1.jpg
          const start = url.lastIndexOf('/')
          return {
            name: url.substring(start + 1), // 41hrdv00591jp-1.jpg
            url
          }
        })
        // 5. 磁力搜索
        const searchLink = document.querySelector('.hidden-xs a[href*="/search/"]')
        const search = searchLink ? searchLink.getAttribute('href') : ''
        // info 678
        const map = { 0: 'av', 1: 'release_date', 2: 'length' }
        const infoMap = {
          '/director/': 'director',
          '/studio/': 'studio', // 制作商
          '/label/': 'label', // 发行商
          '/series/': 'series', // 系列
          // '/genre/': 'genre'
        }
        // 识别码 发行时间 时间长度
        const info1 = Array.from(document.querySelectorAll('.info p')).reduce((acc, cur, index) => {
          const text = cur.innerText
          const key = map[index]
          if (key) {
            acc[key] = text.split(': ')[1]
          }
          return acc
        }, {})
        // 导演 制作商 发行商 系列
        const info = Object.keys(infoMap).reduce((acc, cur) => {
          const selector = document.querySelector(`a[href*="${cur}"]`)
          if (selector) {
            const key = infoMap[cur]
            acc[key] = {
              name: selector.innerText,
              url: selector.getAttribute('href')
            }
          }
          return acc
        }, {})
        // 类别
        const genre = [...document.querySelectorAll('a[href*="/genre/"')].map((item) => item.innerText)
        if (info1.av) {
          const extname = (file) => {
            const start = file.lastIndexOf('.');
            return file.substring(start)
          }
          images.push({
            name: `${info1.av}${extname(screencap)}`,
            url: screencap
          })
        }
        // const tags = Array.from(document.querySelectorAll('.genre')).map((item) => item.innerText)

        return {
          title: title ? title.innerText : '',
          star,
          url: location.href,
          screencap, // 封面
          search,
          images, // 样品图像 sampleImages
          genre,
          ...info,
          ...info1,
        }
      }
      return [ getHtml() ]
    })
  } catch (e) {
    throw e
  }
}

module.exports = {
  getHtml
}


// function getHtml(params){}

// const selectorMap = {
//   title: '.container h3', //
//   // ---info---
//   id, // 识别码、番号
//   releaseDate, // 发行时间
//   length, // 长度
//   director, // 导演
//   studio, // 制作商
//   label, // 发行商
//   series, // 系列
//   genre // 类别
// }
