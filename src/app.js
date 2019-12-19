
const Koa = require('koa')
const Router = require('koa-router')
const c = require('ansi-colors')

const { connect } = require('./mongo/db')
const doubanDb = connect('douban')

const movie = require('../src/models/movie')

const app = new Koa()
const router = new Router()

const port = 3000
const log = console.log

async function query() {
  const one = await movie.find({ id : 1291546})
  console.log(one)
}

router.get('/v1/movie/top250', (ctx, next) => {

  const path = ctx.params
  const query = ctx.request.query // ? 查询参数
  const headers = ctx.request.header
  const body = ctx.request.body // 需要安装koa-bodyparser

  // ctx.body = res.subjects

  ctx.body = {
    path,
    query,
    headers,
    body
  }
})


app.use(router.routes())

app.listen(3000)
log(c.green(`http://localhost:${port} `) + `${new Date().toLocaleString()}`)