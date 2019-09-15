const puppeteer = require('puppeteer')
const c = require('ansi-colors')
require('module-alias/register')

const { executablePath } = require('@config/index')
const { auth } = require('@config/ip')
const { sleep } = require('@helper/tools')

class Browser {
  constructor(option) {
    this.options = {
      headless: true,
      ignoreHTTPSErrors: true,
      executablePath,
      ...option
    }
  }
  async launch() {
    if(!this.browser) {
      this.browser = await puppeteer.launch(this.options)
    }
    return this.browser
  }

  async goto(url, proxy, options) {
    if(!this.browser) {
      await this.launch()
    }
    const page = await this.browser.newPage()
    if(proxy) {
      await page.authenticate(auth);
    }
    await page.setViewport({ width: 1920, height: 1200 })
    try {
      console.log(`${c.green('fetch')} ${url}`)
      await page.goto(url, {
        timeout: 0,
        waitUntil: 'networkidle2',
        ...options
      })
    } catch (e) {
      console.log(e)
    }
    return page
  }

  async close() {
    if (!this.browser) {
      return
    }
    await this.browser.close()
  }

  // async newPage() {
  //   if(!this.browser) {
  //     await this.launch()
  //   }
  //   const page = await this.browser.newPage()
  //   await page.setViewport({ width: 1920, height: 1200 })
  //   return page
  // }
}


module.exports = {
  Browser
}

/**
 * @description a Browser test
 * @param {Array} urls
 */
async function test(urls) {
  const instance = new Browser({
    headless: false
  })

  for (let i = 0; i < urls.length; i++) {
    const page = await instance.goto(urls[i])
    console.log(await page.title());
    let flag = await page.$('.j.a_show_full')
    await sleep(2000)
    await page.close()
  }
  
  await instance.close()

}

// test(['http://google.com', 'http://nodejs.cn/api/', 'https://muyiy.cn/question/js/79.html'])

// test(['https://book.douban.com/subject/26981197/'])