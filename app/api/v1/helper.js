/**
 * @description 获取数据
 * @param {object} ctx
 * @param {object} model
 * @param {string} key 查询关键字
 * @returns
 */
async function getData(ctx, model, key) {
  let { start = 0, count = 20, q } = ctx.request.query
  start = Number.isNaN(Number(start)) ? 0 : Number.parseInt(start)
  let query = q ? { [key]: new RegExp(q, 'i') } : {}

  const data = await model.find(query).skip(start).limit(Number.parseInt(count))
  return data
}

module.exports = {
  getData
}
