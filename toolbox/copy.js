const fs = require('fs')
const fsp = fs.promises
const path = require('path')
const fse = require('fs-extra')
const dirname = 'F:\\bilibili\\红楼梦'

/**
 * 1. 遍历目录下所有文件夹
 * 2. 循环文件夹下的对应子目录，找到并复制xml文件到目标文件夹(output)
 * todo
 */
async function main(source, output) {
  await fse.ensureDir(output)
  const list = await getDirs(source)
  console.log(list)
  const p = list.map(item => {
    const xmlFile = path.resolve(source, item, '1', `${item}_1.xml`)
    const outputFile = path.resolve(output, `${item}_1.xml`)
    return fse.pathExistsSync(xmlFile) ? copyFile(xmlFile, outputFile) : Promise.resolve(1)
  })

  const renameTask = list.map(item => {
    const iniFile = path.resolve(source, item, 'desktop.ini')
    const outputFile = path.resolve(source, item, 'desktop.txt')
    return fse.pathExistsSync(iniFile) ? copyFile(iniFile, outputFile) : Promise.resolve(1)
  })
  // await Promise.allSettled(p) // todo
}

async function getDirs(source) {
  const list = await fsp.readdir(source)
  return list.filter(item => {
    const itemPath = path.resolve(source, item)
    return fs.statSync(itemPath).isDirectory()

    // const xmlFile = path.resolve(source, item, '1', `${item}_1.xml`)
    // return fse.pathExistsSync(xmlFile)
  })
}

function fileExists(file) {
  const xmlFile = path.resolve(file, '1', `${file}_1.xml`)
  return fse.pathExistsSync(xmlFile)
}

async function copyFile(...args) {
  return fse.copy(...args)
}


main(dirname, path.resolve(dirname, '字幕'))

