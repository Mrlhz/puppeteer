/**
 * @description 根据 `https://book.douban.com/tag/?view=type` 网站编写，返回`标签集合`html内容
 * @param {puppeteer.page} page
 * @returns {Array} 
 */
async function getBookTagsHtml(page) {
  try {
    return await page.evaluate(() => {
      const list = [] // document.querySelectorAll('.tagCol tbody td')
      const tagCol = document.querySelectorAll('.tagCol') // table
      document.querySelectorAll('a.tag-title-wrapper').forEach((a, index) => {
        const name = a.getAttribute('name')
        tagCol.item(index).querySelectorAll('tbody td').forEach((td) => {
          const tag = td.innerText ? td.innerText.replace(/[)]/, '') : '' // e.g 小说(6027382) => 小说(6027382
          let [tagName, value] = tag.split('(') // ["小说", "6027382"]
          value = Number(value)
          list.push({ tag: tagName, value, type: name })
        })
      })
      return list
    })
  } catch (e) {
    console.log(e)
  }
}

async function getHotTagsHtml(page) {
  try {
    const html = await page.evaluate(() => {
      let list = Array.from(document.querySelectorAll('.tagCol td')).map((td) => {
        let tag = td.innerText // e.g 小说(5985492)
        let [title, value] = tag.split('(') // ["小说", "5985492)"]
        value = Number(value.replace(')', ''))
        return { title, value }
      })

      return {
        type: 'hot',
        total: list.length,
        tags: list
      }
    })
    return html;

  } catch (e) {
    throw e
  }
}

module.exports = {
  getBookTagsHtml,
  getHotTagsHtml
}

/**
 * `https://book.douban.com/tag/?view=cloud` 所有热门标签
 */

/**
 * `https://book.douban.com/tag/?view=type` 分类浏览
 */

