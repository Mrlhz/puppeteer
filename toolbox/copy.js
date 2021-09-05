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
  copyFiles(source, output, list)
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
    if (item.includes('弹幕') || item.includes('字幕')) {
      return false
    }
    return fs.statSync(itemPath).isDirectory() || item.includes('desktop.ini')
  })
}

async function copyFiles(source, output, list) {
  const xmlFile1 = path.resolve(source, list[0], '1', `${list[0]}_1.xml`)
  let result = []
  if (fse.pathExistsSync(xmlFile1)) {
    result = customizeCopy(source, output, list)
  } else {
    result = originalCopy(source, output, list)
  }
  await Promise.allSettled(result)
  console.log(result)
}

// 单个下载到自定义目录
function customizeCopy(source, output, list) {
  const result = []
  list.forEach(file => {
    const xmlFile = path.resolve(source, file, '1', `${file}_1.xml`)
    const outputFile = path.resolve(output, `${file}_1.xml`)
    const iniFile = path.resolve(source, file, 'desktop.ini')
    const iniOutputFile = path.resolve(source, file, 'desktop.txt')
    fse.pathExistsSync(xmlFile) && result.push(copyFile(xmlFile, outputFile))
    fse.pathExistsSync(iniFile) && result.push(copyFile(iniFile, iniOutputFile))
  })
  return result
}

// 合集下载
function originalCopy(source, output, list) {
  const result = list.map(file => {
    let files = []
    const filePath = path.resolve(source, file)
    if (fs.statSync(filePath).isDirectory()) {
      files = fs.readdirSync(filePath, { encoding: 'utf8' }) //
    }
    const xmlFile = files.find(item => item.includes('.xml'))
    if (xmlFile) {
      const xmlFilePath = path.resolve(source, file, xmlFile)
      const xmlFileOutputPath = path.resolve(output, xmlFile)
      return copyFile(xmlFilePath, xmlFileOutputPath)
    }
    return Promise.resolve(1) // desktop.ini
  })
  const iniFile = path.resolve(source, 'desktop.ini')
  const iniOutputFile = path.resolve(source, 'desktop.txt')
  if (fse.pathExistsSync(iniFile)) {
    fse.copySync(iniFile, iniOutputFile)
  }
  return result
}

function copyXmlFile(source, output, list) {
  const p = list.map(file => {
    const xmlFile1 = path.resolve(source, file, '1', `${file}_1.xml`)
    if (fse.pathExistsSync(xmlFile1)) {
      const outputFile = path.resolve(output, `${file}_1.xml`)

      const iniFile = path.resolve(source, file, 'desktop.ini')
      const iniOutputFile = path.resolve(source, file, 'desktop.txt')
      console.log(1)
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
        const iniFile = path.resolve(source, 'desktop.ini')
        const iniOutputFile = path.resolve(source, 'desktop.txt')
        if (fse.pathExistsSync(iniFile)) {
          fse.copySync(iniFile, iniOutputFile)
        }
        console.log(2)
        return Promise.all([copyFile(xmlFilePath, xmlFileOutputPath)])
      }
    }
  })

  return Promise.resolve(1)
}

async function copyFile(...args) {
  return fse.copy(...args)
  // try {
  //   return fse.copy(...args)
  // } catch (error) {
  //   return Promise.reject('fail')
  // }
}


// const dirname = 'E:\\bilibili\\红楼梦'
const dirname = 'E:\\bilibili\\新女驸马\\14395169'
// const dirname = 'E:\\bilibili\\12789987' // 济公游记
main(dirname, path.resolve(dirname, '弹幕'))
