const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
// const dirname = 'E:\\图小乐\\DSMP'
const dirname = 'E:\\村花\\图小乐'


// remove file
async function removeFiles (src, dest) {
  try {
    await fse.remove('/tmp/myfile')
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}

// With async/await:
async function move (src, dest) {
  try {
    await fse.move(src, dest)
    console.log('success')
  } catch (err) {
    console.error(err)
  }
}

function readdirSync(dirs) {
  let files = fs.readdirSync(dirs, {
    encoding: 'utf8'
  })
  return files
}

async function moveOut() {
  // 读取目录的内容
  // files 是目录中文件的名称的数组
  let files = readdirSync(dirname)
  const firstLevelDirectory = [] // 第一层
  const secondLevelDirectory = [] // 第二层

  files.forEach(item => {
    const file = path.resolve(dirname, item)
    if (fs.statSync(file).isDirectory()) {
      firstLevelDirectory.push(file)
    }
  })
  // console.log(firstLevelDirectory)
  firstLevelDirectory.forEach(p => {
    const firstLevelFiles = readdirSync(p)
    const file = firstLevelFiles[0] || '' // 为空时会报错
    console.log('filePath', p, file)
    const filePath = path.resolve(p, file)
    console.log(firstLevelFiles)
    // && fs.statSync(filePath).isFile()
    // 文件夹或文件都移出
    if (firstLevelFiles.length === 1) {
      secondLevelDirectory.push(filePath)
    }
  })
  // console.log(secondLevelDirectory)
  if (!secondLevelDirectory.length) {
    return 0
  }
  const pathArray = []
  const funcs = secondLevelDirectory.map(item => {
    const arr = item.split(path.sep)
    // console.log(arr[arr.length -2])
    const removeItem = arr.splice(arr.length -2, 1)
    const oldPath = item

    if (/^\d+$/.test(removeItem) && !arr[arr.length - 1].startsWith('0')) {
      arr[arr.length - 1] = removeItem + '-' + arr[arr.length - 1]
    }
    const newPath = path.resolve(...arr)
    // console.log('oldPath', oldPath)
    // console.log('newPath', newPath)
    // console.log('arr', arr)
    pathArray.push({ oldPath, newPath })
    if (oldPath === newPath) {
      return 1
    }
    return move(oldPath, newPath)
  })
  console.log(pathArray)
  await Promise.allSettled(funcs)
  return [1]
}

/**
 * @description 文件夹移出一层
 *
 */

async function init() {
  let filesPath = moveOut()
  console.log('----------------------------------------------------------')
}
init()

// console.log(filesPath)
