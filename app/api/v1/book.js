const Router = require('koa-router')

const bookBrief = require('../../../src/models/bookBrief')

const router = new Router({
  prefix: '/v1/book'
})

router.get('/', async (ctx, next) => {
  const { start = 0, count = 20, q } = ctx.request.query
  let query = q ? { title: new RegExp(q, 'i') } : {}
  const books = await bookBrief.find(query).skip(Number(start)).limit(count)
  ctx.body = {
    books,
    total: books.length
  }
})

module.exports = router