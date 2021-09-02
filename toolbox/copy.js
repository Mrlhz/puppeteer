const fs = require('fs')
const fsp = fs.promises
const path = require('path')
const fse = require('fs-extra')

/**
 * 1. 遍历目录下所有文件夹
 * 2. 循环文件夹下的对应子目录，找到并复制xml文件到目标文件夹(output)
 * todo
 */
async function main(source, output) {
  if (!fse.pathExistsSync(source)) { return }
  await fse.ensureDir(output)
  const list = await getDirs(source)
  console.log(list)
  copyXmlFile(source, output, list)
  // const p = list.map(item => {
  //   const xmlFile = path.resolve(source, item, '1', `${item}_1.xml`)
  //   const outputFile = path.resolve(output, `${item}_1.xml`)
  //   return fse.pathExistsSync(xmlFile) ? copyFile(xmlFile, outputFile) : Promise.resolve(1)
  // })

  // const renameTask = list.map(item => {
  //   const iniFile = path.resolve(source, item, 'desktop.ini')
  //   const outputFile = path.resolve(source, item, 'desktop.txt')
  //   return fse.pathExistsSync(iniFile) ? copyFile(iniFile, outputFile) : Promise.resolve(1)
  // })
  // await Promise.allSettled(p) // todo
}

async function getDirs(source) {
  const list = await fsp.readdir(source)
  return list.filter(item => {
    const itemPath = path.resolve(source, item)
    if (item.includes('字幕')) {
      return false
    }
    return fs.statSync(itemPath).isDirectory() || item.includes('desktop.ini')

    // const xmlFile = path.resolve(source, item, '1', `${item}_1.xml`)
    // return fse.pathExistsSync(xmlFile)
  })
}

function copyXmlFile(source, output, list) {
  const p = list.map(file => {
    const xmlFile1 = path.resolve(source, file, '1', `${file}_1.xml`)
    if (fse.pathExistsSync(xmlFile1)) {
      const outputFile = path.resolve(output, `${file}_1.xml`)

      const iniFile = path.resolve(source, file, 'desktop.ini')
      const iniOutputFile = path.resolve(source, file, 'desktop.txt')
      return Promise.all([copyFile(xmlFile1, outputFile), copyFile(iniFile, iniOutputFile)])
    } else {
      let files = []
      let filePath = path.resolve(source, file)
      if (fs.statSync(filePath).isDirectory()) {
        files = fs.readdirSync(filePath, { encoding: 'utf8' })
      }
      const xmlFile = files.find(item => item.includes('.xml'))
      if (xmlFile) {
        const xmlFilePath = path.resolve(source, file, xmlFile)
        const xmlFileOutputPath = path.resolve(output, xmlFile)
        // console.log(xmlFile, xmlFilePath, xmlFileOutputPath)
        const iniFile = path.resolve(source, 'desktop.ini')
        const iniOutputFile = path.resolve(source, 'desktop.txt')
        // return copyFile(xmlFilePath, xmlFileOutputPath)
        if (!fse.pathExistsSync(iniOutputFile)) {
          fse.copySync(iniFile, iniOutputFile)
        }
        return Promise.all([copyFile(xmlFilePath, xmlFileOutputPath)])
      }
    }
  })

  return Promise.resolve(1)
}

async function copyFile(...args) {
  return fse.copy(...args)
}


// const dirname = 'F:\\bilibili\\红楼梦'
// const dirname = 'F:\\bilibili\\新女驸马\\14395169'
// const dirname = 'E:\\bilibili\\12789987' // 济公游记
const dirname = 'E:\\bilibili\\66225504' // 风云雄霸天下
main(dirname, path.resolve(dirname, '弹幕'))
