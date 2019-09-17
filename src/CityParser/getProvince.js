const path = require('path')

require('module-alias/register')

const { writeFile } = require('@helper/tools')
const { Browser } = require('@helper/browser')
const { getProvinceHtml } = require('./getAreaHtml')


async function getProvince(url) {
  let browser = new Browser()

  let page = await browser.goto(url)

  let list = await getProvinceHtml(page)

  writeFile('province.min.json', list, {
    output: path.resolve(__dirname, '../../data/area')
  })

  await browser.close()

}

getProvince('http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/index.html')
