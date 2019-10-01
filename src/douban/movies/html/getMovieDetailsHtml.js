/**
 * @description 根据 `https://movie.douban.com/subject/1307914/` 网站编写，返回`一部电影`html内容
 *
 * @param {puppeteer.Page} page
 * @returns
 */
async function getMovieDetailsHtml(page) {
  const info = await page.$('#info')
  if (!info) {
    return {errMsg: await page.title()}
  }
  try {
    const html = await page.evaluate(() => {
      // getHtml
      const obj = {
        '导演': 'directors',
        '编剧': 'screenwriter',
        // '主演': 'actor',
        '类型': 'genres',
        '制片国家/地区': 'countries',
        '语言': 'language',
        '上映日期': 'initial_release_date',
        '片长': 'runtime',
        '又名': 'original_title',
        'IMDb链接': 'imdb' // http://www.imdb.com/title/tt10627720 ?
      }

      const summary = document.querySelector('#link-report')
      const info = document.querySelector('#content .article #info')
      let res = {}
      res.url = location.href;
      if (info) {
        info.innerText.split('\n').filter(v => v).forEach((item) => {
          const index = item.indexOf(':')
          const key = item.substring(0, index).trim()
          const value = item.substring(index + 1).trim()

          if (key && obj[key]) {
            if (key === '导演' || key === '编剧' || key === '类型' || key === '上映日期' || key === '又名' || key === '语言') {
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
      let actors = []
      document.querySelectorAll('.actor a[href*="/celebrity"]').forEach((item) => {
        const name = item.innerText
        const url = location.origin + item.getAttribute('href')
        actors.push({name, url})
      })
      const a = document.querySelector('#wrapper h1 span[property="v:itemreviewed"]') // title
      const rating_num = document.querySelector('#content .rating_num') // 豆瓣评分
      const year = document.querySelector('h1 span.year') // 年份
      const img = document.querySelector('#wrapper .nbgnbg') // 缩略图
      const comments_count = document.querySelector('#comments-section h2 a') // 短评数
      const image = document.querySelector('a.nbgnbg img')
      const rating_people = document.querySelector('.rating_people span') // 评价人数
      const id = location.href.split('subject/')[1]
      res.id = id ? Number(id.replace('/', '')) : ''; // https://book.douban.com/subject/[]/
      res.title = a ? a.innerText : ''; // 
      res.year = year ? Number( year.innerText.replace(/\(|\)/g, '') ) : '';
      res.image = image ? image.getAttribute('src') : '';
      res.images = {
        more: img ? img.getAttribute('href') : '' // 点击看更多海报
      };
      res.rating_people = rating_people ? Number(rating_people.innerText) : ''; // 评价人数
      res.rating = rating_num ? Number(rating_num.innerText) : ''; // 评价人数
      res.comments_count = comments_count.innerText ? '' : '';
      res.summary = summary ? summary.innerText.replace('\n\n举报','') : ''; // 内容简介
      res.actors = actors
      // getHtml end
      return res
    })
    return html
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
