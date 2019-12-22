const c = require('ansi-colors')
const log = console.log

async function insert(model, list=[], queryKey = {}) {
  const { id = 'id', name = 'name' } = queryKey
  list = list.map((item) => setData(model, item))
  async function setData(model, item) {
    const m = await model.findOne({
      [id]: item[id]
    })
    if (m) {
      log(`${c.red('fail')}: ${item[name]}(${item[id] ? item[id] : ''}) existed`)
      return m
    } else {
      const res = await new model(item).save()
      log(c.green('insert success:'), res[name] ? res[name] : '', res[id] ? res[id] : '')
      return res
    }
  }

  return Promise.all(list)
}

module.exports = {
  insert
}
