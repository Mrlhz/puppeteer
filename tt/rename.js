/**
 * @description 文件改名
 */

const fs = require('fs')
const path = require('path')
const process = require('process')

function getInputParams() {
  const params = process.argv.slice(2).reduce((acc, cur) => {
    let [key, value] = cur.split('=')
    console.log([key, value])
    !Number.isNaN(Number(value)) ? value = Number(value) : value
    acc[key] = value
    return acc
  }, {})
  return params
}

function readDirSync(filters = () => {}) {
  // 读取目录的内容
  // files 是目录中文件的名称的数组
  let files = fs.readdirSync(__dirname, {
    encoding: 'utf8'
  })
  const dirs = [] // 筛选为目录的文件名
  files.forEach(item => {
    const file = path.resolve(__dirname, item)
    console.log(item, file)
    if (filters(item)) {
      dirs.push(file)
    }
  })
  return dirs
}

let filesPath = readDirSync(item => {
  console.log(path.parse(item))
  return !item.includes('.js')
})

const params = getInputParams()
console.log(filesPath, params)

function rename(newName = '') {
  newName = newName || params.name
  filesPath.forEach(item => {
    const { name, ext } = path.parse(item)
    fs.renameSync(item, `${newName}${ext}`)
  })
}

rename()

// function mkJSON(data = []) {
//   const str = JSON.stringify(data, null, 2)
//   const filePath = path.resolve(__dirname, 'list.json')
//   fs.writeFileSync(filePath, str)
// }

// function mkMarkdown(data = []) {
//   data.forEach(item => {
//     fs.renameSync(item.pictureOldPath, item.pictureNewPath)
//     fs.renameSync(item.oldDir, item.newDir)
//   })
// }
