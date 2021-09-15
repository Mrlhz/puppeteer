const path = require('path')

const fs = require('fs-extra')
const iconvLite = require('iconv-lite')

async function getIniFile(dir) {
  let files = await fs.readdir(dir)
  return files.map(item => path.resolve(dir, item, 'desktop.ini')).filter(item => fs.pathExistsSync(item))
}

/**
 * @see https://github.com/ashtuchkin/iconv-lite
 * @param {String} file
 * @returns
 */
function read(file) {
  const text = fs.readFileSync(file)
  return iconvLite.decode(text, 'gbk')
}

async function compilerIniText(src) {
  const list = await getIniFile(src)
  const data = list.map(item => {
    const text = read(item)
    const title = text.match(/InfoTip=(.*?)\n/) // console.log(text.split('\n')[1].split('=')[1])
    return {
      title: title ? title[1] : '',
      path: item,
      dir: path.dirname(item)
    }
  })
  return data
}

function generateJSON(filePath, data) {
  if (!fs.pathExistsSync(filePath)) return

  const file = path.resolve(filePath, `list.json`)
  fs.outputJSONSync(file, data)
}

function generateMarkdown(filePath, data) {
  if (!fs.pathExistsSync(filePath)) return

  const file = path.resolve(filePath, `list.md`)
  const text = data.map(item => `- ${item.title}`).join('\n')
  fs.outputFileSync(file, text)
}

async function init(src) {
  const data = await compilerIniText(src)
  generateJSON(src, data)
  generateMarkdown(src, data)
  console.log(data[0])
}



init('E:\\bilibili\\鬼畜')
