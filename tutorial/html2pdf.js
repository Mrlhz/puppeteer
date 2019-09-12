const path = require('path');

const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors')
const c = require('ansi-colors');

require('module-alias/register')

const { executablePath } = require('@config/index')

const { sleep, mkdirSync, writeFile } = require('../src/helper/tools')

const { books_mdn } = require('../src/config/index')


/**
 * @description 保存页面为pdf convertHTMLToPDF 
 * @todo 排版格式需要优化
 *
 * @param {Array} urls URL to navigate page to. The url should include scheme, e.g. https://
 */
async function html2pdf(urls) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath
  });

  let len = urls.length;
  for (let i = 0; i < len; i++) {
    const page = await browser.newPage();

    // await page.emulate(devices['iPhone X'])
    await page.setViewport({
      width: 1920,
      height: 1200
    });

    page.on("console", msg => {
      for (let i = 0; i < msg.args.length; ++i) {
        console.log(`${jobId} - From page. Arg ${i}: ${msg.args[i]}`);
      }
    });

    try {
      console.log(`${c.green('fetch')} ${urls[i]}`);
      await page.goto(urls[i], {
        timeout: 0,
        waitUntil: 'networkidle2' // 当至少500毫秒的网络连接不超过2个时，考虑导航已经完成
      });

      await sleep(3000);
      await page.emulateMedia('screen');
      let title = await page.title()
      const fileName = title.replace('|', '-') + '.pdf'
      await page.pdf({
        path: path.resolve(books_mdn, fileName),
        printBackground: true, // 是否打印背景图
        width: '1520px',
        // format: 'A2', // A2
        // displayHeaderFooter: true, // 显示页眉和页脚
        // headerTemplate: '<span style="font-size: 30px; width: 200px; height: 200px; background-color: black; color: white; margin: 20px;">url</span>',
        // footerTemplate: '<span style="font-size: 30px; width: 50px; height: 50px; background-color: red; color:black; margin: 20px;">Footer date</span>',
        // margin: {
        //   top: '50px',
        //   right: '20px',
        //   bottom: '20px',
        //   left: '20px'
        // }
        // marginTop: '100px',
        // marginRight: '500px',
        // marginBottom: '1000px'
      });
      console.log(`${c.bgGreen('done')} ${(i + 1)}/${len}`);
      console.log(`${c.cyan('file:')} ${fileName}`);
      await page.close();
    } catch (e) {
      console.log(e);
    }
  }


  await browser.close();
}


/**
 * `JavaScript 标准内置对象`
 */
const urls = [
  'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp',
  'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array',
  'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date',
  'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String',
  'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object',
  'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math',
  'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number',
  'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function',
  'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence'
]

var u = [
  'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply',
  'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind',
  'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call',
  'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this',
  'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Index',
  'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain',
  'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Memory_Management',
  'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects'
]


/**
 * `保存页面为pdf，保存目录在D:/books/mdn`
 */

html2pdf(urls.slice(8,9))
// html2pdf(urls)
// html2pdf(u)

// html2pdf(['file:///D:/books/mdn/Operator_Precedence.html'])

// html2pdf(['file:///D:/books/mdn/html/0.html'])
