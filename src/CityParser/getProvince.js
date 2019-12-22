const path = require('path')

require('module-alias/register')

const { writeFile } = require('@helper/tools')
const { Browser } = require('@helper/browser')
const { getProvinceHtml } = require('./getAreaHtml')
const { connect } = require('../mongo/db')
const Province = require('../models/city/province')
const { insert } = require('./util')

const db = connect('city')

async function getProvince(url) {
  let browser = new Browser()

  let page = await browser.goto(url)

  let list = await getProvinceHtml(page)

  await writeFile({
    fileName: 'province.min1.json',
    data: list,
    output: path.resolve(__dirname, '../../data/area')
  })

  await insert(Province, list, {
    id: 'id',
    name: 'name'
  })

  await browser.close()
  process.exit(0)
}

getProvince('http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/index.html')
