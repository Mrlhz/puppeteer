const requireDirectory = require('require-directory')
const Router = require('koa-router')

class initManager {

  static initCore(app) {
    this.app = app
    this.initLoadRouters()
    this.loadConfig()
  }

  static initLoadRouters() {
    const apiDirectory = process.cwd() + '/api'
    requireDirectory(module, apiDirectory, {
      visit: whenLoadModule
    })

    function whenLoadModule(obj) {
      if(obj instanceof Router) {
        initManager.app.use(obj.routes())
      }
    }
  }

  static loadConfig(path) {
    const configPath = path || process.cwd() + '/config/index.js'
    const config = require(configPath)
    global.config = config
  }
}

module.exports = {
  initManager
}
