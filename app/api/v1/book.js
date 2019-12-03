const Router = require('koa-router')

const bookBrief = require('../../../src/models/bookBrief')
const bookTags = require('../../../src/models/bookTags')
const { getData } = require('./helper')

const router = new Router({
  prefix: '/v1/book'
})

router.get('/', async (ctx, next) => {
  const books = await getData(ctx, bookBrief, 'title')
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