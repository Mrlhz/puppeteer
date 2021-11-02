const path = require('path')
const fs = require('fs-extra')

const files = [
  '0 LOGO.png',
  '0 地址发布页.url',
  '029c.jpg',
  '图小乐.png',
  '图小乐.txt',
  '图小乐.url',
  '由@18233整理分享.txt'
]

function isAdFiles(file) {
  const { base, ext } = path.parse(file)
  if (['.7z', '.zip', '.rar', '.js', '.json'].includes(ext)) {
    return false
  }
  if (fs.statSync(file).size <= 42 * 1024) {
    return true
  }
  if (files.includes(base)) {
    return true
  }
}

async function remove (src) {
  try {
    await fs.remove(src)
    console.log('success')
  } catch (err) {
    console.error(err)
  }
}

async function move(src, dest) {
  try {
    await fs.move(src, dest, { overwrite: true })
    console.log('success')
  } catch (err) {
    console.error('err', err)
  }
}

async function outputJson (dest, data) {
  try {
    await fs.outputJson(dest, data)
    console.log('success')
  } catch (err) {
    console.error(err)
  }
}

/**
 * @description 移动数组files中的文件到 dest目录
 * @param {*} [files=[]]
 * @param {*} dest
 * @returns
 */
async function moveFiles(files = [], dest) {
  const list = files.map(file => {
    const { base } = path.parse(file)
    const output = path.resolve(dest, base)
    return fs.move(file, output, { overwrite: true })
  })
  return Promise.allSettled(list)
}

async function AdClear (adFiles = []) {
  const list = adFiles.map(item => remove(item))
  await Promise.allSettled(list)
}


function deepSync(dir, adFiles) {
  fs.readdirSync(dir).forEach(file => {
    let child = path.resolve(dir, file)
    let stat = fs.statSync(child)
    if (stat.isDirectory()) {
      deepSync(child, adFiles)
    } else {
      isAdFiles(child) && adFiles.push(child)
      isAdFiles(child) && console.log(child)
    }
  })
}

async function initClear(adFiles, RecycleBin) {
  const res = await moveFiles(adFiles, RecycleBin)
  console.log(res)
}


/**
 * @description 清除文件夹中的广告文件
 */
{
  // let dirname = `E:\\图小乐\\桜桃喵\\YTM`
  let dirname = `E:\\图小乐\\天天一元`
  let RecycleBin = 'E:\\图小乐\\RecycleBin'
  const outputJsonFile = path.resolve(RecycleBin, `${path.parse(dirname).name}-${Date.now()}.json`)
  let adFiles = []
  deepSync(dirname, adFiles)
  adFiles.length && outputJson(outputJsonFile, adFiles)
  initClear(adFiles, RecycleBin)
}
