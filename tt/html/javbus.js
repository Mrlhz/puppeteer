/**
 * `https://www.seedmm.work`
 * `https://www.dmmbus.work`
 * `https://www.cdnbus.work`
 * `https://www.busdmm.work`
 * @description 返回`作品集合`html内容
 * @param {puppeteer.Page} page
 */
async function getLists(page) {
  try {
    return await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#waterfall .item a.movie-box')).map((item) => {
        let title = item.innerText ? item.innerText.split('\n')[0] : item.innerText
        let [av, date] = [...item.querySelectorAll('.photo-info date')].map((date) => date.innerText)
        return {
          av: av || '',
          date: date || '',
          title: title.trim() || '',
          url: item.getAttribute('href') || ''
        }
      })
    })
  } catch (e) {
    throw e
  }
}

/**
 * @description 根据 `https://www.javbus.com` 网站编写，返回`一部作品`html内容
 * @param {puppeteer.Page} page
 */
async function getOne(page) {
  try {
    return await page.evaluate(() => {
      function getHtml() {
        // 1. 标题
        const title = document.querySelector('.container h3')
        // 2. 封面
        let screencap = document.querySelector('.screencap img')
        screencap = screencap ? screencap.getAttribute('src') : ''
        // 3. 磁力链接
        const magnet = Array.from(document.querySelectorAll('#magnet-table tr')).map((item) => {
          const magnet = [...item.querySelectorAll('td')].reduce((acc, cur, index) => {
            const keyMap = ['', 'size', 'date']
            if (index === 0) {
              acc['name'] = cur.innerText
              acc['link'] = cur.querySelector('a') ? cur.querySelector('a').getAttribute('href') : ''
            } else {
              const key = keyMap[index];
              acc[key] = cur.querySelector('a') ? cur.querySelector('a').innerText : ''
            }
            return acc
          }, {})
          return magnet
        }).filter((link) => link.link)
        // 4. 样品图像
        const images = Array.from(document.querySelectorAll('#sample-waterfall a.sample-box')).map((item) => {
          const url = item.getAttribute('href') // https://pics.dmm.co.jp/digital/video/h_1100hzgb00025/h_1100hzgb00025jp-1.jpg
          const start = url.lastIndexOf('/')
          const photo_frame = item.querySelector('.photo-frame img')
          return {
            name: url.substring(start + 1), // h_1100hzgb00025jp-1.jpg
            url,
            sample: photo_frame ? photo_frame.getAttribute('src') : ''
          }
        })
        // info
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
          if (key) acc[key] = text.split(': ')[1]
          return acc
        }, {})
        // 导演 制作商 发行商 系列
        const getBase = (url, key) => { return /https?/.test(url) ? url.split(key)[1] : '' }
        const info = Object.keys(infoMap).reduce((acc, cur) => {
          const selector = document.querySelector(`a[href*="${cur}"]`)
          if (selector) {
            const key = infoMap[cur]
            const url = selector.getAttribute('href')
            acc[key] = {
              name: selector.innerText,
              url,
              base: getBase(url, cur)
            }
          }
          return acc
        }, {})
        // 类别
        const genre = [...document.querySelectorAll('a[href*="/genre/"')].map((item) => item.innerText)
        if (info1.av) {
          const extname = (file) => {
            const start = file.lastIndexOf('.')
            return file.substring(start)
          }
          images.push({
            name: `${info1.av}${extname(screencap)}`,
            url: screencap
          })
        }
        // 演员
        const star = [...document.querySelectorAll('.genre a[href*="/star/"')].map((item) => {
          const url = item.getAttribute('href')
          return {
            name: item.innerText,
            url,
            base: getBase(url, '/star/')
          }
        })

        return {
          title: title ? title.innerText : '',
          star,
          url: location.href,
          screencap, // 封面
          magnet,
          images, // 样品图像 sampleImages
          genre,
          ...info,
          ...info1,
          idols: ''
        }
      }
      return [ getHtml() ]
    })
  } catch (e) {
    throw e
  }
}

// https://avmask.com/cn/series/58499519eb38d3b3

module.exports = {
  getLists,
  getOne
}
