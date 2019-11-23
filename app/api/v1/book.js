const Router = require('koa-router')

const bookBrief = require('../../../src/models/bookBrief')

const router = new Router({
  prefix: '/v1/book'
})

router.get('/', async (ctx, next) => {
  const books = await bookBrief.find({}).limit(100)
  ctx.body = {
    // books,
    total: books.length
  }
})

module.exports = router
