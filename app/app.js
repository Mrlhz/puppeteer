const Koa = require('koa')
const parser = require('koa-bodyparser')
const c = require('ansi-colors')

const { catchError } = require('./middlewares/catchError')
const { initManager } = require('./core/init')
const asyncLog = require('./middlewares/log')

const { connect } = require('../src/mongo/db')
const doubanDb = connect('douban')

const app = new Koa()

const log = console.log
const port = 5000

app.use(catchError)
app.use(asyncLog)
app.use(parser())

initManager.initCore(app)

app.listen(port)
log(c.green(`http://localhost:${port} `) + `${new Date().toLocaleString()}`)
