/**
 * @description 获取html内容
 * @param {puppeteer.page} page
 * @todo 容错处理 switch 中获取html可以抽取成一个函数
 * @returns
 */
async function getAreaHtml(page) {
  try {
    return await page.evaluate(() => {
      return getHtml()
      function getHtml() {
        let href = location.href
        const index = href.lastIndexOf('/')
        let keys = ['tr.citytr', 'tr.countytr', 'tr.towntr', 'tr.villagetr'].filter((item) => document.querySelector(item))
        if (!keys[0]) return {
          errMsg: document.body.innerText
        }
        switch (keys[0]) {
          case 'tr.citytr':
            return Array.from(document.querySelectorAll('tr.citytr')).map((item) => {
              let code = item.querySelectorAll('a').item(0).innerText
              return {
                code,
                id: code ? code.substring(0, 4) : '',
                pid: code ? code.substring(0, 2) : '', // parentId
                name: item.querySelectorAll('a').item(1).innerText,
                type: 'city',
                level: 2,
                url: href.substring(0, index) + '/' + item.querySelectorAll('a').item(1).getAttribute('href'),
              }
            })
      
          case 'tr.countytr':
            return Array.from(document.querySelectorAll('tr.countytr')).map((item) => {
              if (item.querySelectorAll('a').length > 0) {
                let code = item.querySelectorAll('a').item(0).innerText
                return {
                  code,
                  id: code ? code.substring(0, 6) : '',
                  pid: code ? code.substring(0, 4) : '',
                  type: 'county',
                  level: 3,
                  name: item.querySelectorAll('a').item(1).innerText,
                  url: href.substring(0, index) + '/' + item.querySelectorAll('a').item(1).getAttribute('href'),
                }
              } else {
                // e.g. 市辖区 http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/13/1301.html
                let code = item.querySelectorAll('td').item(0).innerText
                return {
                  code,
                  type: 'county',
                  level: 3,
                  name: item.querySelectorAll('td').item(1).innerText
                }
              }
            })
      
          case 'tr.towntr':
            return Array.from(document.querySelectorAll('tr.towntr')).map((item) => {
              let code = item.querySelectorAll('a').item(0).innerText
              return {
                code,
                id: code ? code.substring(0, 9) : '',
                pid: code ? code.substring(0, 6) : '',
                name: item.querySelectorAll('a').item(1).innerText,
                type: 'town',
                level: 4,
                url: href.substring(0, index) + '/' + item.querySelectorAll('a').item(1).getAttribute('href'),
              }
            })
      
          case 'tr.villagetr':
            return Array.from(document.querySelectorAll('tr.villagetr')).map((item) => {
              let code = item.querySelectorAll('td').item(0).innerText
              return {
                code,
                id: code ? code : '',
                pid: code ? code.substring(0, 9) : '',
                type: item.querySelectorAll('td').item(1).innerText,
                level: 5,
                name: item.querySelectorAll('td').item(2).innerText,
                todo: 0
              }
            })
      
          default:
            break;
        }
      }
    })
  } catch (e) {
    console.log(e)
  }
}

// http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/index.html
// http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/%s

/**
 * @description 获取省份
 * @param {puppeteer.page} page
 * @returns
 */
async function getProvinceHtml(page) {
  try {
    return await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.provincetr td a')).map((item) => {
        let link = item.getAttribute('href')
        return {
          name: item.innerText.replace('\n', ''),
          id: link.split('.')[0],
          code: link.split('.')[0],
          url: 'http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/' + link
        }
      })
    })
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  getAreaHtml,
  getProvinceHtml
}
