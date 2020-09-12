const path = require('path')

const { connect } = require('../mongo/db')
const db = connect('city')
const City = require('../models/city/city')

const { writeFile } = require('../helper/tools')

function handle(list) {
  return list.map((item) => {
    const levels = { 2: 1, 4: 2, 6: 3, 9: 4, 12: 5 }
    const types = { 2: '', 4: 'city', 6: 'county', 9: 'town', 12: 'village' }

    item.type = item.type ? item.type : types[item.id.length]
    item.level = item.level ? item.level : levels[item.id.length]

    return item
  })
}

/**
 * @description 数据库查询相应数据并返回
 * @param {Object} params
 */
async function findList(params={}) {
  const { conditions , projection = null } = params
  return await City.find(conditions, projection)
}

async function generatorMinList(list=[], root) {
  await writeFile({
    fileName: root + '.min.json',
    data: list,
    output: __dirname
  })
}

async function generatorHashList(list=[], root) {
  const hash = {}
  for (const item of list) {
    hash[item.id] = item
  }

  await writeFile({
    fileName: root + '.hash.json',
    data: hash,
    output: __dirname
  })

  return hash
}

async function generatorTreeList(list=[], hash, root) {
  console.time('time')
  if (!Array.isArray(list)) return
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
    fileName: root + '.tree.min.json',
    data: res,
    output: __dirname
  })

  console.timeEnd('time')
  return res
}

async function run(root) {
  const list = await findList({
    conditions: { code: new RegExp('^' + root) }, // /^12/
    // projection: { id: 1, pid: 1, code: 1, name: 1, _id: 0 },
    projection: { url: 0, __v: 0, _id: 0, todo: 0 }
  })

  await generatorMinList(list, root)

  const hash = await generatorHashList(list, root)

  // TODO
  const tree = await generatorTreeList(list, hash, root)

  console.log(tree)

  process.exit(0)
}

// run('11')

// todo
const list = require('./11.min.json')
const hash = require('./11.hash.json')
generatorTreeList(list, hash, '11')
