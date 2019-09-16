/**
 * @description 根据 `https://book.douban.com/tag/编程?start=980&type=T` 网站编写，返回`作品集合`html内容，每页20条
 *
 * @param {puppeteer.Page} page
 * @returns
 */
async function getBookListByTagHtml(page) {
  try {
    const html = await page.evaluate(() => {
      const errMsg = document.querySelector('body').innerText
      if (errMsg.indexOf('检测到有异常请求') !== -1) {
        return {errMsg} // 检测到有异常请求从你的 IP 发出，请 登录 使用豆瓣。
      } else {
        return Array.from(document.querySelectorAll('#subject_list .subject-list .subject-item')).map((li) => {
          const a = li.querySelector('.info h2 a')
          const p = li.querySelector('.info p')
          const rating_nums = li.querySelector('.star .rating_nums')
          const pub = li.querySelector('.info .pub')
          const img = li.querySelector('.pic a img')
        
          return {
            title: a ? a.getAttribute('title') : '',
            url: a ? a.getAttribute('href') : '',
            rating: rating_nums ? Number(rating_nums.innerText):'', // 评分.innerText
            publish: pub ? pub.innerText : '',
            image: img ? img.getAttribute('src') : '',
            summary: p ? p.innerText : ''
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
  getBookListByTagHtml
}
