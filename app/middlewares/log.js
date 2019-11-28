
function log(ctx) {
  console.log(ctx.method, ctx.header.host, ctx.url)
}


async function asynclog(ctx, next) {
  console.log(ctx.method, ctx.header.host, ctx.url)
  await next()
}

// module.exports = function() {
//   return async function(ctx, next) {
//     log(ctx)
//     await next()
//   }
// }


module.exports = asynclog