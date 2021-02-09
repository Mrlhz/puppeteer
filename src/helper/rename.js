/**
 * @description 遍历一个文件夹，将它的子目录文件夹改名，子文件夹里面的文件改名
 */

const fs = require('fs')
const path = require('path')

function isTorrent(url = '') {
  if (typeof url !== 'string') return false
  return /\.(torrent)$/.test(url.toLocaleLowerCase())
}

function isImage(url = '') {
  if (typeof url !== 'string') return false
  return /\.(jpg|png|gif|jpeg|webp)$/.test(url.toLocaleLowerCase())
}

/**
 * @description 验证文件是否为音视频文件格式
 * @links https://www.cnblogs.com/byx1024/p/13345355.html?utm_source=tuicool
 * @param {string} [url='']
 * @returns
 */
function isCon(url = '') {
  if (typeof url !== 'string') return false
  return /\.(avi|wmv|mpg|mpeg|mov|rm|ram|swf|flv|mp4|mp3|wma|avi|rm|rmvb|flv|mpg|mkv)$/.test(url.toLocaleLowerCase())
}

function getName(file) {
  const { name } = path.parse(file)
  return name
}

function readDirSync() {
  // 读取目录的内容
  // files 是目录中文件的名称的数组
  let files = fs.readdirSync(__dirname, { encoding: 'utf8' })
  const dirs = [] // 筛选为目录的文件名
  files.forEach(item => {
    const file = path.resolve(__dirname, item)
    if (fs.statSync(file).isDirectory()) {
      dirs.push(file)
    }
  })
  return dirs
}

let filesPath = readDirSync()
// console.log(filesPath)


const result = filesPath.map(item => {
  const files = fs.readdirSync(item, { encoding: 'utf8' })
  // console.log(item)
  const torrent = files.find(value => isTorrent(value))
  const picture = files.find(value => isImage(value))
  const title = files.find(value => isCon(value))
  const name = getName(title)
  const oldName = path.basename(item)

  const newPicture = `${name}${path.parse(picture).ext}`
  const pictureOldPath = path.resolve(item, picture)
  const titleOldPath = path.resolve(item, title)
  // const titleNewPath = path.resolve(item, title)
  const pictureNewPath = path.resolve(item, newPicture)
  return {
    name,
    dir: oldName,
    oldDir: item,
    newDir: path.resolve(__dirname, `${name}--${oldName}`),
    torrent: getName(torrent),
    oldPicture: getName(picture),
    newPicture,
    pictureOldPath,
    pictureNewPath,
    titleOldPath
  }
})

function mkJSON(data = []) {
  const str = JSON.stringify(data, null, 2)
  const filePath = path.resolve(__dirname, 'list.json')
  fs.writeFileSync(filePath, str)
}

function mkMarkdown(data = []) {
  data.forEach(item => {
    fs.renameSync(item.pictureOldPath, item.pictureNewPath)
    fs.renameSync(item.oldDir, item.newDir)
  })
}

// 运行输出
// console.log(result)
// mkJSON(result)
// mkMarkdown(result)

let res = fs.readdirSync(__dirname, { withFileTypes: true })
let res2 = fs.readdirSync(__dirname, { withFileTypes: false })

console.log(res)
function is(flag) {
  return flag ? '是' : '不是'
}


res.forEach(item => {
  console.log(`${item.name.padEnd(20)} ${is(item.isFile())}文件 ${is(item.isDirectory())}文件夹`)
})
