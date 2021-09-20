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

async function compilerIniText(src) {
  const filePathList = await getIniFilePath(src)
  const result = filePathList.map(item => {
    const text = readIniFile(item)
    const title = text.match(/InfoTip=(.*?)\n/) // console.log(text.split('\n')[1].split('=')[1])
    return {
      title: title ? title[1] : '',
      path: item,
      dir: path.dirname(item),
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

async function writeTxtFile(data = []) {
  const taskList = data.map(item => {
    const { dir, name } = path.parse(item.path)
    const outputFilePath = path.resolve(dir, `${name}.txt`)
    const outputFile = () => fs.outputFile(outputFilePath, item.text, { encoding: 'utf8' })
    return fs.pathExistsSync(outputFilePath) ? Promise.resolve('exist') : outputFile()
  })
  await Promise.allSettled(taskList)
}

async function init(src) {
  const data = await compilerIniText(src)
  generateJSON(src, data)
  generateMarkdown(src, data)
  await writeTxtFile(data)
  console.log(data[0])
}



// init('E:\\bilibili\\鬼畜')
// init('E:\\bilibili\\电视剧')
init('E:\\bilibili\\电影')
// readIniFile('E:\\bilibili\\电影\\84264321\\desktop.ini')
