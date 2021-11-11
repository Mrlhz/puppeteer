const path = require('path')
const fs = require('fs-extra')
// const { copyFile } = fs.promises
// ['access', 'copyFile', 'open', 'opendir', 'rename', 'truncate', 'rmdir', 'mkdir', 'readdir', 'readlink', 'symlink', 'lstat', 'stat', 'link', 'unlink', 'chmod', 'lchmod', 'lchown', 'chown', 'utimes', 'realpath', 'mkdtemp', 'writeFile', 'appendFile', 'readFile']

function getFiles(source, dest) {
  if (fs.pathExistsSync(source) && fs.pathExistsSync(dest)) {
    const sourceList = fs.readdirSync(source, { encoding: 'utf-8' })
    const destList = fs.readdirSync(dest, { encoding: 'utf-8' })
    return { sourceList, destList }
  }
  return {}
}

function getList({ sourceList, destList }) {
  if (!sourceList || !destList) {
    return
  }
  // const equalList = sourceList.filter(item => sourceList.includes(item) && destList.includes(item))
  // const differenceList = sourceList.filter(item => !equalList.includes(item))
  // const otherList = destList.filter(item => !sourceList.includes(item)) // source中没有，dest有
  // 已下载 || 名字相同的项
  const equalList = sourceList.filter(item => {
    return destList.find(ele => ele.includes(item))
  })

  const differenceList = sourceList.filter(item => !equalList.includes(item))
  // source中没有，dest有
  const otherList = destList.filter(item => {
    return !sourceList.find(ele => {
      const itemLength = item.length
      const eleLength = ele.length
      if (itemLength >= eleLength) {
        return item.includes(ele)
      } else {
        return ele.includes(item)
      }
    })
  })
  return { sourceList, destList, differenceList, equalList, otherList }
}


function compilerMarkdownText(list) {
  if (!list) return
  const { sourceList, destList, differenceList, equalList, otherList } = list
  const equalListText = equalList.map(item => `[x] ${item}`).join('\n')
  const differenceListText = differenceList.map(item => `[ ] ${item}`).join('\n')
  const otherListText = otherList.map(item => `[x] ${item}`).join('\n')

  const markdownText = equalListText + '\n' + differenceListText + setSeparate() + otherListText
  return markdownText
}

function generateMarkdown(filePath, data) {
  if (!data) return
  if (!fs.pathExistsSync(filePath)) return
  const file = path.resolve(filePath, `${path.parse(source).name}.md`)
  fs.outputFileSync(file, data)
}

function setSeparate() {
  const splitLine = '-'.repeat(100)
  return `\n${splitLine}\n`
}

// const source = 'D:\\md\\avmoo\\水卜さくら'
// const dest = 'F:\\迅雷下载\\水卜樱（水卜さくら-Miura Sakura）'

const source = 'D:\\md\\avmoo\\楓カレン'
const dest = 'F:\\迅雷下载\\楓カレン'

// 对比两个目录文件得到相同项，不同项
function init() {
  const files = getFiles(source, dest)
  const list = getList(files)
  const text = compilerMarkdownText(list)
  generateMarkdown(source, text)
}

init()

