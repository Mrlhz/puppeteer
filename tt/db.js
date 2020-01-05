const process = require('process')

const c = require('ansi-colors')

// const doubanDb = 'mongodb://localhost/bt'
const btbook = require('./models/bt')

const log = console.log

async function save(data = {}) {
  const hash = await btbook.findOne({ hash: data.hash })
  if (!hash) {
    const res = await new btbook(obj).save()
    console.log(c.bgGreen('insert'), res)
  } else {
    console.log(c.bgRed('exist'), hash)
  }

  process.exit(0)
}

const magnet = ''
// const obj = {
//   title: '',
//   info: '',
//   magnet,
//   hash: magnet.split(':')[3],
//   stars: [{
//     name: '',
//     url: ''
//   }],
//   type: ['', '91'],
//   images: ['']
// }

// save(obj)

module.exports = {

}
