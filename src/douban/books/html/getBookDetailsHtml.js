/**
 * @description 根据 e.g.`https://book.douban.com/subject/26829016/` 网站编写，返回`一本书`html内容
 *
 * @param {puppeteer.Page} page
 * @returns
 */
async function getBookDetailsHtml(page) {
  try {
    const html = await page.evaluate(() => {
      const errMsg = document.querySelector('body').innerText
      if (!document.querySelector('#content .article #info')) {
        return { doesNotExist: document.title, id: Number(location.href.match(/\/(\d+)\//)[1])}
      }
      if (errMsg.indexOf('检测到有异常请求') !== -1) {
        return {errMsg} // 检测到有异常请求从你的 IP 发出，请 登录 使用豆瓣。
      } else {
        // getHtml
        function getHtml() {
          const map = {
            '作者': 'author', // 作者
            '出版社': 'publisher', // 出版社
            '出品方': 'producer', // 出品方
            '副标题': 'subtitle', // 副标题
            '原作名': 'original', // 原作名
            '译者': 'translator', // 译者
            '出版年': 'pubdate', // 出版年
            '页数': 'pages', // 页数
            '定价': 'price', // 定价
            '装帧': 'binding', // 装帧
            '丛书': 'series', // 丛书
            'ISBN': 'isbn',
          }
          const summary = document.querySelector('#link-report')
          const info = document.querySelector('#content .article #info')
          let res = {}
          res.url = location.href;
          if (info) {
            info.innerText.split('\n').filter(v => v).forEach((item) => {
              const index = item.indexOf(':')
              const key = item.substring(0, index)
              const value = item.substring(index + 1).trim()
  
              if (key && map[key]) {
                if (key === '作者' || key === '译者') {
                  res[map[key]] = value.split(' / ')
                } else if (key === 'ISBN' || key === '页数') {
                  res[map[key]] = Number(value)
                } else {
                  res[map[key]] = value
                }
              }
            })
          }
          const rating_num = document.querySelector('#content .rating_num')
  
          const a = document.querySelector('a.nbg')
          const image = document.querySelector('a.nbg img')
          const rating_people = document.querySelector('.rating_people span')
          const id = location.href.split('subject/')[1]
          res.id = id ? Number(id.replace('/', '')) : ''; // https://book.douban.com/subject/[id]/
          res.title = a ? a.getAttribute('title') : document.querySelector('h1 span[property="v:itemreviewed"]').innerText; // 
          res.category = ''; // 分类
          res.image = image ? image.getAttribute('src') : '';
          res.images = {
            large: a ? a.getAttribute('href') : ''
          };
          res.rating_people = rating_people ? Number(rating_people.innerText) : ''; // 评价人数
          res.rating = rating_num ? Number(rating_num.innerText) : ''; // 评价人数
  
          res.summary = summary ? summary.innerText.replace('\n\n举报', '').trim() : ''; // 内容简介

          return res
        }
        // getHtml end 可复制到chrome控制台查看res
        return getHtml()
      }
    })
    return html
  } catch (e) {
    throw e
  }
}


module.exports = {
  getBookDetailsHtml
}


// 图书info
// document.querySelector('#content .article .subjectwrap').querySelector('#info').innerText.split('\n').forEach((item) => {
//   console.log(item)
// })
