
/**
 * @description 获取html内容
 * @param {puppeteer.page} page
 * @todo 容错处理
 * @returns
 */
async function getAreaHtml(page) {
  try {
    const result = await page.evaluate(() => {
      let href = location.href
      const index = href.lastIndexOf('/')
      let keys = ['tr.citytr', 'tr.countytr', 'tr.towntr', 'tr.villagetr'].filter((item) => document.querySelector(item))
      switch (keys[0]) {
        case 'tr.citytr':
          return Array.from(document.querySelectorAll('tr.citytr')).map((item) => {
            let code = item.querySelectorAll('a').item(0).innerText
            return {
              code,
              name: item.querySelectorAll('a').item(1).innerText,
              url: href.substring(0, index) + '/' + item.querySelectorAll('a').item(1).getAttribute('href'),
              id: code ? code.substring(0,4) : '',
              pid: code ? code.substring(0,2) : '' // parentId
            }
          })
        
        case 'tr.countytr':
          return Array.from(document.querySelectorAll('tr.countytr')).map((item) => {
            if (item.querySelectorAll('a').length > 0) {
              let code = item.querySelectorAll('a').item(0).innerText
              return {
                code,
                name: item.querySelectorAll('a').item(1).innerText,
                id: code ? code.substring(0, 6) : '',
                pid: code ? code.substring(0, 4) : '',
                url: href.substring(0, index) + '/' + item.querySelectorAll('a').item(1).getAttribute('href'),
              }
            } else {
              let code = item.querySelectorAll('td').item(0).innerText
              return {
                code,
                name: item.querySelectorAll('td').item(1).innerText
              }
            }
          })

        case 'tr.towntr':
          return Array.from(document.querySelectorAll('tr.towntr')).map((item) => {
            let code = item.querySelectorAll('a').item(0).innerText
            return {
              code,
              name: item.querySelectorAll('a').item(1).innerText,
              id: code ? code.substring(0, 9) : '',
              pid: code ? code.substring(0, 6) : '',
              url: href.substring(0, index) + '/' +item.querySelectorAll('a').item(1).getAttribute('href'),
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
              name: item.querySelectorAll('td').item(2).innerText
            }
          })

        default:
          break;
      }

    })
    return result
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  getAreaHtml,
  getProvinceHtml
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
          code: link.split('.')[0],
          url: 'http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/' + link
        }
      })
    })
  } catch (e) {
    console.log(e)
  }
}


/**
 * 111表示：主城区
 * 112表示：城乡结合区
 * 121表示：镇中心区
 * 122表示：镇乡结合区
 * 123表示：特殊区域
 * 210表示：乡中心区
 * 220表示：村庄
 */

// ['tr.citytr', 'tr.countytr', 'tr.towntr', 'tr.villagetr'].filter((item) => document.querySelector(item))

// province
// Array.from(document.querySelectorAll('.provincetr td a')).map((item) => {
//   let link = item.getAttribute('href')
//   return {
//     name: item.innerText.replace('\n', ''),
//     code: link.split('.')[0],
//     url: 'http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/' + link
//   }
// })

// city
// let href = location.href
// const index = href.lastIndexOf('/')
// Array.from(document.querySelectorAll('tr.citytr')).map((item) => {
//   let code = item.querySelectorAll('a').item(0).innerText
//   return {
//     code,
//     name: item.querySelectorAll('a').item(1).innerText,
//     url: href.substring(0, index) + '/' + item.querySelectorAll('a').item(1).getAttribute('href'),
//     id: code ? code.substring(0,4) : '', // 
//     pid: code ? code.substring(0,2) : '' // parentId
//   }
// })

// county
// let href = location.href
// const index = href.lastIndexOf('/')
// Array.from(document.querySelectorAll('tr.countytr')).map((item) => {
//   if (item.querySelectorAll('a').length > 0) {
//     let code = item.querySelectorAll('a').item(0).innerText
//     return {
//       code,
//       name: item.querySelectorAll('a').item(1).innerText,
//       id: code ? code.substring(0, 6) : '',
//       pid: code ? code.substring(0, 4) : '',
//       url: href.substring(0, index) + '/' + item.querySelectorAll('a').item(1).getAttribute('href'),
//     }
//   } else {
//     let code = item.querySelectorAll('td').item(0).innerText
//     return {
//       code,
//       name: item.querySelectorAll('td').item(1).innerText
//     }
//   }
// })

// town
// let href = location.href
// const index = href.lastIndexOf('/')
// Array.from(document.querySelectorAll('tr.towntr')).map((item) => {
//   let code = item.querySelectorAll('a').item(0).innerText
//   return {
//     code,
//     name: item.querySelectorAll('a').item(1).innerText,
//     id: code ? code.substring(0, 9) : '',
//     pid: code ? code.substring(0, 6) : '',
//     url: href.substring(0, index) + '/' +item.querySelectorAll('a').item(1).getAttribute('href'),
//   }
// })


// village
// let href = location.href
// const index = href.lastIndexOf('/')
// Array.from(document.querySelectorAll('tr.villagetr')).map((item) => {
//   let code = item.querySelectorAll('td').item(0).innerText
//   return {
//     code,
//     id: code ? code : '',
//     pid: code ? code.substring(0, 9) : '',
//     type: item.querySelectorAll('td').item(1).innerText,
//     name: item.querySelectorAll('td').item(2).innerText
//   }
// })
