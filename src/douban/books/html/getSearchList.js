/**
 * @description 根据 `https://search.douban.com/book/subject_search?search_text=javascript&cat=1001&start=0` 网站编写，返回`图书集合`html内容
 * @param {puppeteer.Page} page
 * @returns
 */
async function getSearchListHtml(page) {
  try {
    return await page.evaluate(() => {
      const list = document.querySelectorAll('#root .item-root')
      if (list.length) {
        const item = Array.from(document.querySelectorAll('.item-root'))
          .filter((item) => item.querySelector('.detail a[href*="https://book.douban.com/subject/"]'))
          .map((item) => {
            const a = item.querySelector('.title a')
            const url = a ? a.getAttribute('href') : ''
            const id = url ? Number(url.match(/\/(\d+)\//)[1]) : ''
            const title = a ? a.innerText : ''
            const rating = item.querySelector('.rating_nums') ? Number(item.querySelector('.rating_nums').innerText) : ''
            const pl = item.querySelector('.rating .pl') ? item.querySelector('.rating .pl').innerText : ''
            const image = item.querySelector('a.cover-link img')
            const publish = item.querySelector('.meta.abstract') ? item.querySelector('.meta.abstract').innerText : ''

            return {
              id,
              url,
              title,
              image: image ? image.getAttribute('src') : '',
              rating,
              rating_people: pl.match(/\d+/) ? Number(pl.match(/\d+/)[0]) : pl.replace(/[()]/g, ''),
              publish
            }
          })
        return item
      } else {
        return {
          errMsg: document.querySelector('body') ? document.body.innerText : ''
        } // e.g. 检测到有异常请求从你的 IP 发出，请 登录 使用豆瓣。
      }
    })
  } catch (e) {
    throw e
  }
}


module.exports = {
  getSearchListHtml
}