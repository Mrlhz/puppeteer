const path = require('path')

const c = require('ansi-colors')

const { proxyServer } = require('../../config/ip')
const { wait, writeFile } = require('../../helper/tools')
const { books_mdn_data } = require('../../config/index')
const { Browser } = require('../browser')
const { getBookDetailsHtml } = require('./html//getBookDetailsHtml')

/**
 * @description 获取豆瓣图书简介 e.g. `https://book.douban.com/subject/27028517/`
 *
 * @param {Array} urls 导航的地址
 * @param {Object} [options={}]
 * @todo 
 */
async function getBookDetails(urls, options = {}) {
  console.time('time')
  const { delay = 3000, type = '类型', name = ''} = options
  const len = urls.length
  let items = []
  const instance = new Browser({
    // args: [proxyServer]
  })

  for (let i = 0; i < len; i++) {
    const page = await instance.goto(urls[i]) // 'proxy'
    console.log('title', await page.title())
    let click = await page.$('.j.a_show_full') // 内容简介 展开全部
    if(click) await page.click('.j.a_show_full')
    try {
      const item = await getBookDetailsHtml(page)
      items.push(item)
      haveOneSave(item, i)
      console.log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
    } catch (e) {
      console.log(`${c.bgGreen('fail')} ${(i + 1)}/${len}`)
    }
    if (len > 1) await wait(delay)
    await page.close()
  }

  const result = {
    type,
    total: items.length,
    subjects: items
  }
  let fileName = name ? name : type + '-details'
  writeFile(fileName + '.json', result, {
    output: books_mdn_data
  })
  
  await instance.close()
  console.timeEnd('time')
}

function haveOneSave(item, name) {
  writeFile(name + '.json', item, {
    output: path.resolve(books_mdn_data, 'temp')
  })
}


module.exports = {
  getBookDetails
}


/**
 * `测试`
 */
const { name, subjects } = require('D:/books/mdn/data/诗词-simple.json')

const urls = subjects.map((item) => item.url)

// console.log(name)

// 根据标签遍历1000本书
getBookDetails(urls, {
  delay: 4500,
  type: name
})



// 获取一本或几本书
// getBookDetails(['https://book.douban.com/subject/26836700/'], {
//   delay: 5000,
//   type: '编程',
//   name: '输出文件名'
// })

// 内容简介需要展开
// https://book.douban.com/subject/1446625/
// https://book.douban.com/subject/27028517/



function filter(data) {
  let arr = []
  for (let i = 0; i < 183; i++) {
    try {
      let item = require('D:\\books\\mdn\\data\\temp\\' + i + '.json')
    } catch (e) {
    console.log(e);
      arr.push(i)
    }    
  }
  console.log(arr);
}


// filter()