const { HttpException } = require('../core/httpException')

async function catchError(ctx, next) {
  try {
    await next()
  } catch (e) {
    const isHttpException = e instanceof HttpException
    const isDev = global.config.environment === 'dev'

    if (isDev && !isHttpException) {
      // throw e
      console.log(e)
    }
    if (isHttpException) {
      ctx.body = {
        msg: e.msg,
        errorCode: e.errorCode,
        request: `${ctx.method} ${ctx.path}`
      }
    } else {
      ctx.body = {
        msg: 'we made a mistake',
        errorCode: 999,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = 500
    }
  }
}

module.exports = {
  catchError
}
