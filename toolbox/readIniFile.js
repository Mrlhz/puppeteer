const path = require('path')
const http = require('http')

const fs = require('fs-extra')
const iconvLite = require('iconv-lite')

async function getIniFile(dir) {
  let files = await fs.readdir(dir)
  return files.map(item => path.resolve(dir, item, 'desktop.ini')).filter(item => fs.pathExistsSync(item))
}

function read(file) {
  const text = fs.readFileSync(file)
  return iconvLite.decode(text, 'gbk')
}

// async function init() {
//   const list = await getIniFile('E:\\bilibili\\鬼畜')

//   const server = http.createServer((err, res) => {
//     const text = read(list[0])
//     console.log(text.toString('utf8'))
//     // res.writeHead(200, {'Content-Type': 'text/html;charset=UTF8'})
//     res.end(text)
//   })

//   server.listen(3000, '127.0.0.1')
// }

async function init() {
  const list = await getIniFile('E:\\bilibili\\鬼畜')
  const data = list.map(item => {
    const text = read(item)
    // console.log(text.split('\n')[1].split('=')[1])
    const title = text.match(/InfoTip=(.*?)\n/)
    return {
      title: title ? title[1] : '',
      path: item,
      dir: path.dirname(item)
    }
  })
  console.log(data)
}

init()
