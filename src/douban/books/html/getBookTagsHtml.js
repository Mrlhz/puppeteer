/**
 * @description 根据 `https://book.douban.com/tag/?view=type` 网站编写，返回`标签集合`html内容
 * @param {puppeteer.page} page
 * @returns {Array} 
 */
async function getBookTagsHtml(page) {
  try {
    const result = await page.evaluate(() => {
      const list = [];
      let tagCol = document.querySelectorAll('.tagCol');
      document.querySelectorAll('a.tag-title-wrapper').forEach((a, index) => {
        let name = a.getAttribute('name')
        let tags = Array.from(tagCol.item(index).querySelectorAll('tbody td')).map((td) => {
          let tag = td.innerText // e.g 港台(8708)
          let [title, value] = tag.split('(') // ["港台", "8708)"]
          value = Number(value.replace(')', ''))
          return { title, value }
        });

        list.push({name, tags})
      });
      return list
    })
    return result
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

// Array.from(document.querySelectorAll('.tagCol td')).map((td) => {
//   let tag = td.innerText // e.g 小说(5985492)
//   let [title, value] = tag.split('(') // ["小说", "5985492)"]
//   value = Number(value.replace(')', ''))
//   return { title, value }
// })


/**
 * `https://book.douban.com/tag/?view=type` 分类浏览
 */

// 1
// let names = document.querySelectorAll('.article a.tag-title-wrapper')

// Array.from(document.querySelectorAll('table.tagCol')).map((item, index) => {
//   let tagsList = Array.from(item.querySelectorAll('a, b'))
//   let tags = []
//   for (let i = 0, len = tagsList.length; i < len; i+=2) {
//     tags.push({
//       title: tagsList[i].innerText,
//       value: tagsList[i+1].innerText.replace(/\(|\)/g, '')
//     })
//   }

//   return {
//     name: names[index].getAttribute('name'),
//     tags
//   }
// })


// 2

// let names = document.querySelectorAll('.article a.tag-title-wrapper')

// Array.from(document.querySelectorAll('table.tagCol')).map((table, index) => {
//   let titles = Array.from(table.querySelectorAll('tr td a'))
//   let tags = Array.from(table.querySelectorAll('tr td b')).map((value, i) => {
//     return {
//       title: titles[i].innerText,
//       value: value.innerText.replace(/\(|\)/g, '')
//     }
//   })

//   return {
//     name: names[index].getAttribute('name'),
//     tags
//   }
// })

// 3

// let tags = []

// $('table.tagCol').each(function (i, v) {
//   var $tagTitle = $('.tag-title-wrapper')[i].getAttribute('name')

//   var $tag = []
//   $(v).find('a').each(function (index, tag) {
//     $tag.push($(tag).text())
//   })
//   var $value = [];
//   $(v).find('b').each(function (index, tag) {
//     $value.push({
//       title: $tag[index],
//       value: $(tag).text().replace(/\(|\)/g, '')
//     })
//   });

//   tags.push({
//     title: $tagTitle,
//     tags: $value
//   })
// })

