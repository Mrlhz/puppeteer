/**
 * @description 根据 `https://movie.douban.com/top250?start=0&filter=` 网站编写，返回`作品集合`html内容，每页25条
 *
 * @param {puppeteer.Page} page
 * @returns
 */
async function getMovieTop250Html(page) {
  try {
    const html = await page.evaluate(() => {
      const errMsg = document.querySelector('body').innerText
      if (errMsg.indexOf('检测到有异常请求') !== -1 || !document.querySelector('.grid_view')) {
        return {errMsg} // 检测到有异常请求从你的 IP 发出，请 登录 使用豆瓣。
      } else {
        return Array.from(document.querySelectorAll('.article .grid_view li .item')).map((item) => {
          const title = item.querySelector('.info .title')
          const rating_nums = item.querySelector('.star .rating_num')
          const inq = item.querySelector('.inq')
          const url = item.querySelector('.pic a')
          const img = item.querySelector('.pic a img')
        
          return {
            title: title ? title.innerText : '',
            url: url ? url.getAttribute('href') : '',
            rating: rating_nums ? Number(rating_nums.innerText):'', // 评分.innerText
            inq: inq ? inq.innerText : '',
            image: img ? img.getAttribute('src') : ''
          }
        })
      }
    })

    return html
  } catch (e) {
    throw e
  }
}


module.exports = {
  getMovieTop250Html
}
