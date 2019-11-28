const Router = require('koa-router')

const bookBrief = require('../../../src/models/bookBrief')
const bookTags = require('../../../src/models/bookTags')

const router = new Router({
  prefix: '/v1/book'
})

router.get('/', async (ctx, next) => {
  let { start = 0, count = 20, q } = ctx.request.query
  start = Number.isNaN(Number(start)) ? 0 : Number.parseInt(start)
  let query = q ? { title: new RegExp(q, 'i') } : {}

  const books = await bookBrief.find(query).skip(start).limit(Number.parseInt(count))
  ctx.body = {
    books,
    total: books.length
  }
})

router.get('/tags', async (ctx, next) => {
  let { q } = ctx.request.query
  let query = q ? { tag: new RegExp(q, 'i') } : {}
  const tags = await bookTags.find(query)
  ctx.body = tags
})

module.exports = router