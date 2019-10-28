/**
 * @description `https://avmask.com/cn/genre`
 */
async function genre(page) {

  return await page.evaluate(() => {
    const result = []
    const types = document.querySelectorAll('.container-fluid h4')
    document.querySelectorAll('.container-fluid .genre-box').forEach((item, index) => {
      const type = types.item(index) ? types.item(index).innerText : '';

      [...item.querySelectorAll('a[href]')].forEach((href) => {
        const title = href ? href.innerText : ''
        const url = href ? href.getAttribute('href') : ''
        result.push({ title, url, type })
      })
    })
    return result
  })
}

module.exports = {
  genre
}