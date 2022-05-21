const path = require('path')
const fs = require('fs-extra')

function readdirSync(dir) {
  let files = fs.readdirSync(dir, { encoding: 'utf-8' })
  return files
}

function readDirectorySync(dir) {
  let files = readdirSync(dir)
  return files.length === 1 ? path.resolve(dir, files[0]) : files.map(item => path.resolve(dir, item))
}

async function move (src, dest, options = {}) {
  try {
    await fs.move(src, dest, options)
    console.log('success')
  } catch (err) {
    console.error(err)
  }
}

function findDirectorySync(dirs) {
  if (!fs.pathExistsSync(dirs)) {
    return 'none'
  }
  let file = readDirectorySync(dirs)
  while(!Array.isArray(file)) {
    if (fs.statSync(file).isDirectory()) {
      file = readDirectorySync(file)
    }
    if (Array.isArray(file)) {
      return path.dirname(file[0])
    }
    if (fs.statSync(file).isFile()) {
      return file
    } else {
      console.log('else', file)
      // break
    }
  }
}

function genOutputPath(src, dest) {
  // 过滤掉文件和已经提取出来的文件夹
  const files = readDirectorySync(src).filter(item => fs.statSync(item).isDirectory() && readdirSync(item).length === 1)
  console.log(files.length)
  const list = files.map(item => {
    const file = findDirectorySync(item)
    // console.log(item, 'file:', file)
    const { base } = path.parse(file)
    return {
      src: file,
      dest: path.resolve(dest, base)
    }
  })
  return list
}

async function moveOutNextLevelDirectory(src, dest) {
  if (!fs.pathExistsSync(src) || !fs.pathExistsSync(dest)) return
  const list = genOutputPath(src, dest)
  // console.log(list)
  const tasks = list.map(item => move(item.src, item.dest, { overwrite: false }))
  await Promise.allSettled(tasks)
}

// let dirname = 'E:\\图小乐\\天天一元\\特写集'
{
  let dirname = 'E:\\图小乐\\天天一元\\simu'
  const dest = 'E:\\图小乐\\天天一元\\_simu'
  // moveOutNextLevelDirectory(dirname, dirname)
}


// dirname = 'E:\\图小乐\\天天一元\\SMTX\\SMTX034'
// findDirectorySync(dirname)

// const list = genOutputPath('E:\\图小乐\\天天一元\\特写集', 'E:\\图小乐\\天天一元\\特写集')
// console.log(list)

{
  let src = `E:\\图小乐\\木绵绵`
  const dest = `E:\\图小乐\\木绵绵`
  moveOutNextLevelDirectory(src, dest)
}
