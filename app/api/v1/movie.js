const Router = require('koa-router')

const movieBrief = require('../../../src/models/movieBrief')
const movie = require('../../../src/models/movie')
const { getData } = require('./helper')

const router = new Router({
  prefix: '/v1/movie'
})

router.get('/', async (ctx, next) => {
  const movies = await getData(ctx, movie, 'title')
  ctx.body = {
    movies,
    total: movies.length
  }
})

router.get('/brief', async (ctx, next) => {
  const movies = await getData(ctx, movieBrief, 'title')
  ctx.body = {
    movies,
    total: movies.length
  }
})

module.exports = router