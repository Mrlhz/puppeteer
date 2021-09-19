const path = require('path')

const fs = require('fs-extra')
const iconv = require('iconv-lite')

async function getIniFilePath(dir) {
  let files = await fs.readdir(dir)
  return files.map(item => path.resolve(dir, item, 'desktop.ini')).filter(item => fs.pathExistsSync(item))
}

/**
 * @see https://github.com/ashtuchkin/iconv-lite
 * @param {String} file
 * @returns
 */
 function readIniFile(file) {
  const bufferText = fs.readFileSync(file)
  const result = iconv.decode(Buffer.from(bufferText), 'gbk')
  return result
}

async function getIniFileText(src) {
  const list = await getIniFilePath(src)
  return list.map(item => {
    return {
      file: item,
      text: readIniFile(item)
    }
  })
}

async function compilerIniText(src) {
  const textList = await getIniFileText(src)
  const result = textList.map(item => {
    const text = item.text
    const title = text.match(/InfoTip=(.*?)\n/) // console.log(text.split('\n')[1].split('=')[1])
    return {
      title: title ? title[1] : '',
      path: item.file,
      dir: path.dirname(item.file),
      text
    }
  })
  return result
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

async function writeTxtFile(src) {
  const list = await getIniFileText(src)
  const taskList = list.map(item => {
    const { dir, name } = path.parse(item.file)
    const outputFilePath = path.resolve(dir, `${name}.txt`)
    return fs.outputFile(outputFilePath, item.text, { encoding: 'utf8' })
  })
  await Promise.allSettled(taskList)
}

async function init(src) {
  const data = await compilerIniText(src)
  generateJSON(src, data)
  generateMarkdown(src, data)
  await writeTxtFile(src)
  console.log(data[0])
}



// init('E:\\bilibili\\鬼畜')
// init('E:\\bilibili\\电视剧')
init('E:\\bilibili\\电影')
// readIniFile('E:\\bilibili\\电影\\84264321\\desktop.ini')
