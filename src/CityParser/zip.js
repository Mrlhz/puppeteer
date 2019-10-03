const path = require('path')

const { writeFile } = require('../helper/tools')

const data = require('./data/广东省-town.json')

function zip(data, name) {
  console.time('time')
  console.log(data.length)
  data.forEach((item) => {
    if(item['url']) {
      delete item['url']
    }
  })

  console.log(data.length)

  writeFile({
    fileName: name + '.min.json',
    data,
    output: path.resolve(__dirname, './data')
  })
  console.timeEnd('time')
}

// zip(data, '天津市')


/**
 * @description 处理数据
 *
 * @param {*} params
 */
function handle(params) {
  
}