const Router = require('koa-router')

const movieBrief = require('../../../src/models/movieBrief')
const movie = require('../../../src/models/movie')

const router = new Router({
  prefix: '/v1/movie'
})

router.get('/', async (ctx, next) => {
  let { start = 0, count = 20, q } = ctx.request.query
  start = Number.isNaN(Number(start)) ? 0 : Number.parseInt(start)
  let query = q ? { title: new RegExp(q, 'i') } : {}

  const movies = await movie.find(query).skip(start).limit(Number.parseInt(count))
  ctx.body = {
    movies,
    total: movies.length
  }
})

router.get('/brief', async (ctx, next) => {
  let { start = 0, count = 20, q } = ctx.request.query
  start = Number.isNaN(Number(start)) ? 0 : Number.parseInt(start)
  let query = q ? { title: new RegExp(q, 'i') } : {}

  const movies = await movieBrief.find(query).skip(start).limit(Number.parseInt(count))
  ctx.body = {
    movies,
    total: movies.length
  }
})

module.exports = router