const fs = require('fs')
const path = require('path')

const { writeFile } = require('./tools')
const { temp } = require('../config/index')

/**
 * @description 合并`baseDir`下的所有`json`文件为`all.json`
 *
 * @param {String} baseDir `json`文件所在路径
 * @param {String} [outputDir=''] 输出路径
 * @param {String} [name=''] `*-all.json` `name`
 */
async function mergeFiles(baseDir, outputDir = '', name = Date.now()) {
  let lists = []
  fs.readdirSync(baseDir).forEach((file) => {
    if (file.indexOf('.json') !== -1) {
      let item = require(path.join(baseDir, file));
      lists.push(item);
    } else {
      console.log(file);
    }

  })

  let result = {
    name,
    total: lists.length,
    lists
  }

  console.log(lists.length)
  await writeFile(name + '-all.json', result, {
    output: outputDir
  })
}


/**
 * @description 文件合并 e.g. 将temp目录下 `0.json~999.json` 1000个文件合并
 * @param {String} name
 */
function merge(name, options = {}) {
  const { start = 0, end = 999} = options
  let missing = [] // 存放不存在文件的序号
  let items = []
  for (let i = start; i <= end; i++) {
    try {
      let item = require(path.join(temp, i + '.json'))
      if (item.id) {
        items.push(item)
      } else {
        missing.push(i)
      }
    } catch (e) {
      console.log(e);
      missing.push(i)
    }
  }
  console.log(items.length);
  console.log('missing', missing);
  const result = {
    type: name,
    total: items.length,
    subjects: items
  }
  writeFile(name + '-details.json', result, {
    output: temp
  })
}

module.exports = {
  merge
}


// merge('诗词', {

// })