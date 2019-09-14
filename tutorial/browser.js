const puppeteer = require('puppeteer')
const c = require('ansi-colors')

const { executablePath } = require('../src/config/index')

/**
 * @description 简单封装puppeteer
 * @class Browser
 */
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
      this.browser.once('disconnected', () => {
        this.browser = void 0
      })
    }
    return this.browser
  }

  async close() {
    if (!this.browser) {
      return
    }
    await this.browser.close()
  }

  async goto(url, options) {
    await this.launch()
    const page = await this.browser.newPage()
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

  async newPage() {
    if(!this.browser) {
      await this.launch()
    }
    const page = await this.browser.newPage()
    await page.setViewport({ width: 1920, height: 1200 })
    return page
  }
}


/**
 * @description a test
 * @param {String} url
 */
async function getAPI(url) {
  const browser = new Browser()
  const page = await browser.goto(url)
  // const page = await browser.newPage()
  // await page.goto(url)

  let items = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#column2 ul a')).map((item) => {
      return {
        title: item.innerText ? item.innerText : '',
        url: location.href + item.getAttribute('href')
      }
    })
  })

  console.log(items)

  await browser.close()
}

getAPI('http://nodejs.cn/api/')