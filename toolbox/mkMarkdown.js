const path = require('path')
const fs = require('fs-extra')
// const { copyFile } = fs.promises
// ['access', 'copyFile', 'open', 'opendir', 'rename', 'truncate', 'rmdir', 'mkdir', 'readdir', 'readlink', 'symlink', 'lstat', 'stat', 'link', 'unlink', 'chmod', 'lchmod', 'lchown', 'chown', 'utimes', 'realpath', 'mkdtemp', 'writeFile', 'appendFile', 'readFile']

function getDirectory(source, dest) {
  const sourceList = fs.readdirSync(source, { encoding: 'utf-8' })
  const destList = fs.readdirSync(dest, { encoding: 'utf-8' })
  const equalList = sourceList.filter(item => sourceList.includes(item) && destList.includes(item))
  const differenceList = sourceList.filter(item => !equalList.includes(item))
  const otherList = destList.filter(item => !sourceList.includes(item)) // source中没有，dest有
  return { sourceList, destList, differenceList, equalList, otherList }
}


function compilerMarkdownText(directory) {
  const { sourceList, destList, differenceList, equalList, otherList } = directory
  const equalListText = equalList.map(item => `[x] ${item}`).join('\n')
  const differenceListText = differenceList.map(item => `[ ] ${item}`).join('\n')
  const otherListText = otherList.map(item => `[x] ${item}`).join('\n')

  const markdownText = equalListText + '\n' + differenceListText + setSeparate() + otherListText
  return markdownText
}

function generateMarkdown(filePath, data) {
  if (!fs.pathExistsSync(filePath)) return
  const file = path.resolve(filePath, `${path.parse(source).name}.md`)
  fs.outputFileSync(file, data)
}

function setSeparate() {
  const splitLine = '-'.repeat(100)
  return `\n${splitLine}\n`
}

const source = ''
const dest = ''

const directory = getDirectory(source, dest)
const text = compilerMarkdownText(directory)
generateMarkdown(source, text)
