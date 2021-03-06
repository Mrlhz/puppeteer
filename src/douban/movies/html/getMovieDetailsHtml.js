/**
 * @description 根据 `https://movie.douban.com/subject/1307914/` 网站编写，返回`一部电影`html内容
 *
 * @param {puppeteer.Page} page
 * @returns
 */
async function getMovieDetailsHtml(page) {
  try {
    return await page.evaluate(() => {
      if (!document.querySelector('#content .article #info')) {
        const errMsg = document.body.innerText
        if (errMsg.indexOf('检测到有异常请求') !== -1) {
          return { errMsg }
        }
        return { doesNotExist: document.title, id: Number(location.href.match(/\/(\d+)\//)[1]) }
      } else {
        // getHtml
        function getHtml() {
          const splitList = {
            '导演': 'directors',
            '编剧': 'screenwriter',
            '类型': 'genres',
            '上映日期': 'initial_release_date',
            '又名': 'original_title',
            '制片国家/地区': 'countries',
            '语言': 'language'
          }
          // 导演|编剧|类型|上映日期|又名|制片国家/地区|语言
          const splitListStr = Object.keys(splitList).join('|')
          const obj = Object.assign({}, splitList, {
            '片长': 'runtime',
            'IMDb链接': 'imdb', // http://www.imdb.com/title/tt10627720 ?
            // 电视剧
            '集数': 'episodes',
            '单集片长': 'single_episode_length'
          })

          const summary = document.querySelector('#link-report')
          const info = document.querySelector('#content .article #info')
          let res = {}
          res.url = decodeURIComponent(location.href)
          if (info) {
            info.innerText.split('\n').filter(v => v).forEach((item) => {
              const index = item.indexOf(':') // e.g. 类型: 剧情 / 历史
              const key = item.substring(0, index).trim()
              const value = item.substring(index + 1).trim()
              if (key && obj[key]) {
                if (splitListStr.indexOf(key) !== -1) {
                  res[obj[key]] = value.split(' / ')
                } else if (key === 'IMDb链接') {
                  res[obj[key]] = 'http://www.imdb.com/title/' + value
                } else {
                  res[obj[key]] = value
                }
              }
            })
          }

          // todo 处理演员姓名与url
          let actors = Array.from(document.querySelectorAll('.actor a[href*="/celebrity"]')).map((item) => {
            const name = item.innerText
            const url = location.origin + item.getAttribute('href')
            return { name, url }
          })
          const a = document.querySelector('#wrapper h1 span[property="v:itemreviewed"]') // title
          const rating_num = document.querySelector('#content .rating_num') // 豆瓣评分
          const year = document.querySelector('h1 span.year') // 年份
          const img = document.querySelector('#wrapper .nbgnbg') // 缩略图
          const comments_count = document.querySelector('#comments-section h2 a') // 短评数
          const image = document.querySelector('a.nbgnbg img')
          const rating_people = document.querySelector('.rating_people span') // 评价人数
          const id = location.href.match(/\/(\d+)\//)[1] || location.href.split('subject/')[1]
          res.id = id ? Number(id.replace('/', '')) : ''; // https://book.douban.com/subject/[]/
          res.title = a ? a.innerText : ''; // 
          res.year = year ? Number(year.innerText.replace(/\(|\)/g, '')) : '';
          res.image = image ? image.getAttribute('src') : '';
          res.images = {
            more: img ? img.getAttribute('href') : '' // 点击看更多海报
          };
          res.rating_people = rating_people ? Number(rating_people.innerText) : ''; // 评价人数
          res.rating = rating_num ? Number(rating_num.innerText) : ''; // 评分
          res.comments_count = comments_count.innerText ? Number(comments_count.innerText.replace(/[全部|条]/g, '')) : '';
          res.summary = summary ? summary.innerText.replace('\n\n举报', '') : ''; // 内容简介
          res.actors = actors
          res.top250 = document.querySelector('.top250-no') ? 0 : 1

          return res
        }
        return getHtml()
        // getHtml end
      }
    })
  } catch (e) {
    throw e
  }
}


module.exports = {
  getMovieDetailsHtml
}


const map = {
  id: 0,
  title: '',
  directors: [], // 导演
  screenwriter: [], // 编剧
  actor: [], // 主演 name url
  genres: [], // 类型
  countries: [], // 制片国家/地区
  language: String, // 语言
  initial_release_date: [], // 上映日期
  runtime: String, // 片长
  imdb: {}, // IMDb id: String, url String
  original_title: [], // 又名
  rating: {}, // 评分  average: Number, max: Number, min: Number, stars: String
  casts: [], // name: String,avatars: {large: String}
  comments_count: 0,
  images: {}, // large: String
  reviews_count: 0, // 评论数
  summary: '',
  wish_count: 0,
  year: Number,
}
