class HttpException extends Error {
  constructor(msg = '服务器异常', errorCode = 10000, code = 500) {
    super()
    this.errorCode = errorCode
    this.code = code
    this.msg = msg
  }
}

async function catchError(ctx, next) {
  try {
    await next()
  } catch (e) {
    const isHttpException = e instanceof HttpException
    const isDev = global.config.environment === 'dev'

    if (isDev && !isHttpException) {
      throw e
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
