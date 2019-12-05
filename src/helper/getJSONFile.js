const util = require('util')
const c = require('ansi-colors')

const { Browser } = require('./browser')
const { wait, writeFile } = require('./tools')
const log = console.log

/**
 * @description 获取网页html内容
 * @param {array} [urls=[]]
 * @param {string} [name=Date.now()]
 * @param {string} [dir=__dirname]
 */
async function index(urls = [], name = Date.now(), dir = __dirname) {
  const items = []
  const len = urls.length
  const browser = new Browser({})
  for (let i = 0; i < len; i++) {
    const page = await browser.goto(urls[i])

    const item = await getHtml(page)
    items.push(...item)
    log(`${c.bgGreen('done')} ${(i + 1)}/${len}`)
    if (i !== len - 1) await wait(3000)
    await page.close()
  }

  const result = {
    name,
    total: items.length,
    items
  }

  writeFile({
    fileName: name + '.json',
    data: result,
    output: dir
  })
  await browser.close()
}

// 暂不做容错处理
async function getHtml(page) {
  try {
    const item = await page.evaluate(() => {
      function html() {
        return Array.from(document.querySelectorAll('.boxs .img li')).map((item) => {
          let p = item.querySelectorAll('p')
          let a = item.querySelector('a')
  
          return {
            p: Number.parseInt(p[0].innerText.match(/\d+/)[0]),
            dir: p[4].innerText, // remove [@crepe]
            url: a ? a.getAttribute('href').match(/(\d+)/)[1] : '',
            tags: Array.from(p[3].querySelectorAll('a')).map((tag) => tag.innerText)
          }
        })
      }
      const total = html().reduce((acc, cur) => {
        acc += cur.p
        return acc
      }, 0)
      return html()
    })
    return item
  } catch (e) {
    log(c.red(e))
  }
}

async function _html(page) {
  try {
    return page.evaluate(() => {
      return Array.from(() => {

      })
    })
  } catch (e) {
    log(c.red(e))
  }
}

// test
// index(['https://www.meitulu.com/t/miyu-suenaga/'], '末永みゆ')

const urls = function(baseUrl, start=1, end) {
  const list = []
  for (let i = start; i <= end; i++) {
    list.push(util.format(baseUrl, i))
  }
  return list
}

// todo 第一次直接访问带页码的url有爬虫限制
// const u = urls('https://www.meitulu.com/t/1290/%s.html', 1, 3)
const u = [
  'https://www.meitulu.com/t/1290',
  'https://www.meitulu.com/t/1290/2.html',
  'https://www.meitulu.com/t/1290/3.html'
]
console.log(u);
// index(u, '森萝财团')
index(['https://www.meitulu.com/t/1374/'], '桜桃喵')