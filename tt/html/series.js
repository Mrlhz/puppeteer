/**
 * @description 根据 `https://avmask.com` 网站编写，返回`作品集合`html内容
 *
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

// https://avmask.com/cn/series/58499519eb38d3b3

module.exports = {
  getLists
}
