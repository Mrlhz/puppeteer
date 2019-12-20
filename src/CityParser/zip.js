const path = require('path')

const { connect } = require('../mongo/db')
const db = connect('city')
const City = require('../models/city/city')

const { writeFile } = require('../helper/tools')

function handle(list) {
  const data = list.map((item) => {
    const levels = { 2: 1, 4: 2, 6: 3, 9: 4, 12: 5 }
    const types = {
      2: '',
      4: 'city',
      6: 'county',
      9: 'town',
      12: 'village'
    }

    item.type = item.type ? item.type : types[item.id.length]
    item.level = item.level ? item.level : levels[item.id.length]

    return item
  })

  return data
}

/**
 * @description 数据库查询相应数据并返回
 * @param {Object} params
 */
async function generatorList(params={}) {
  const { conditions , projection = null, treeRoot, options } = params
  const list = await City.find(conditions, projection)
  console.log(list.length, list[15])

  return handle(list)
}

async function generatorTreeList(list=[], root) {
  console.time('time')
  if (!Array.isArray(list)) return

  const hash = {}
  for (const item of list) {
    hash[item.id] = item
  }

  const res = list.reduce((acc, cur) => {
    let pid = cur.pid
    let parent = hash[pid]
    if (parent) {
      parent.children ? parent.children.push(cur) : parent.children = [cur]
    } else if (pid === root) {
      acc.push(cur)
    }
  
    return acc
  }, [])

  await writeFile({
    fileName: root + '.min.json',
    data: list,
    output: __dirname
  })

  await writeFile({
    fileName: root + '.hash.min.json',
    data: hash,
    output: __dirname
  })

  console.log(res)
  await writeFile({
    fileName: root + '.tree.min.json',
    data: res,
    output: __dirname
  })

  console.timeEnd('time')
  return res
}

async function run(root) {

  const res = await generatorList({
    conditions: { code: new RegExp('^' + root) }, // /^12/
    projection: { id: 1, pid: 1, code: 1, name: 1, _id: 0 },
    treeRoot: root
  })

  const tree = await generatorTreeList(res, root)

  console.log(tree)

  process.exit(0)
}

// run('45')

// todo
// const list = require('./12.min.json')
// generatorTreeList(list, '12')
