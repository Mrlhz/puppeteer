/**
 * @description 根据 `https://book.douban.com/tag/编程?start=980&type=T` 网站编写，返回`作品集合`html内容，每页20条
 *
 * @param {puppeteer.Page} page
 * @returns
 */
async function getBookListByTagHtml(page) {
  try {
    return await page.evaluate(() => {
      const list = document.querySelectorAll('#subject_list .subject-list .subject-item')
      if (list.length) {
        return Array.from(list).map((li) => {
          const a = li.querySelector('.info h2 a')
          const p = li.querySelector('.info p')
          const rating_nums = li.querySelector('.star .rating_nums')
          const pl = li.querySelector('.star .pl') ? li.querySelector('.star .pl').innerText.replace(/[()人评价]/g, '') : ''
          const pub = li.querySelector('.info .pub')
          const img = li.querySelector('.pic a img')
          const url = a ? a.getAttribute('href') : ''
          const id = url.match(/\/(\d+)\//) ? Number(url.match(/\/(\d+)\//)[1]) : ''
          console.log(pl);
          return {
            id,
            title: a ? a.getAttribute('title') : '',
            url,
            rating: rating_nums ? Number(rating_nums.innerText) : '', // 评分.innerText
            rating_people: !isNaN(Number(pl)) ? pl : pl + '人评价', // '(6766人评价)'.match(/[\d]{1,}/)[0] || (少于10人评价)
            publish: pub ? pub.innerText : '',
            image: img ? img.getAttribute('src') : '',
            summary: p ? p.innerText : ''
          }
        })
      } else if (list.length === 0) {
        return { errMsg: document.querySelector('#subject_list').innerText } // 没有找到符合条件的图书
      } else {
        return { errMsg: document.querySelector('body').innerText } // 检测到有异常请求从你的 IP 发出，请 登录 使用豆瓣。
      }
    })
  } catch (e) {
    throw e
  }
}


module.exports = {
  getBookListByTagHtml
}
