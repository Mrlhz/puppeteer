
(node:1664) UnhandledPromiseRejectionWarning: TimeoutError: Navigation Timeout Exceeded: 30000ms exceeded
(node:1664) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:1664) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.




[解决**pyppeteer**导航超时问题: pyppeteer.errors.TimeoutError: Navigation Timeout Exceeded: 30000 ms exceeded](https://blog.csdn.net/qq_29570381/article/details/89735639)


page.mouse.click()

处理方法


可能原因

1. 由于网速慢，或者访问国外的网站等原因，网页在30秒内没有加载完成，就会报导航超时错误
2. 协程中乱用time.sleep(), 或者await async.sleep()，比如说睡的时间比较长，很容易导致导航超时错误


### puppeteer抓取网站时报Navigation Timeout Exceeded: 30000ms exceeded问题

- [](www.zhuyuntao.cn/puppeteer抓取网站时报navigation-timeout-exceeded-30000ms-exceeded问题/)

```js
await page.goto(url, {
    timeout: 0
});
```

```js
// 1、设置代理
puppeteer.launch({
args: [
'--proxy-server="direct://"',
'--proxy-bypass-list=*'
]
})

// 2、设置浏览器头信息
await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
await page.setExtraHTTPHeaders({
'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
});
```


### Chrome 控制台的一些错误
- The SSL certificate used to load resources…
SSL 证书被用作加载资源
这样的警告是由于 Chrome 为了督促 Semantec 公司颁发经过安全升级的 PKI 系统颁发的证书，将在 2018 年 10 月 23 日 Chrome 70 发布的时候不在信任在2017 年 12 月 1 日之前颁发的 SSL 证书。所以只要是使用的是2017 年 12 月 1 日之前颁发的 SSL 证书的网站都会出现这样的警告。

- net::ERR_BLOCKED_BY_CLIENT：
意思是被客户端阻止，这个资源加载的错误是由于广告屏蔽的插件屏蔽了广告造成的错误。

- net::ERR_TUNNEL_CONNECTION_FAILED ：
隧道连接失败，这是因为浏览器设置了代理，要解决这个问题，只需要取消代理设置即可。

- Failed to execute 'write' on 'Document':
`Failed to execute 'write' on 'Document': It isn't possible to write into a document from an asynchronously-loaded external script unless it is explicitly opened.`
这是因为异步加载的外部script 脚本文件是不可以执行 document.write() 操作的。如果引入的脚本文件中执行了 document.write() 该操作就会报此错。

- 警告：Mixed Content
这是由于在HTTPS页面里动态的引入HTTP资源造成的，被视为不安全的，

解决方法:

> 方法1：相对协议。
对于同时支持HTTPS和HTTP的资源，引用的时候要把引用资源的URL里的协议头去掉，浏览器会自动根据当前是HTTPS还是HTTP来给资源URL补上协议头的，可以达到无缝切换。
方法2：iframe方式
使用iframe的方式引入HTTP资源，然后将这个页面嵌入到HTTPS页面里就可以了



### 遇到的错误

- Error: net::ERR_EMPTY_RESPONSE

```js
Error: net::ERR_EMPTY_RESPONSE at https://book.douban.com/subject/1883245/
    at navigate (D:\web\myblog\puppeteer\node_modules\puppeteer\lib\FrameManager.js:121:37)
    at process._tickCallback (internal/process/next_tick.js:68:7)
  -- ASYNC --
    at Frame.<anonymous> (D:\web\myblog\puppeteer\node_modules\puppeteer\lib\helper.js:111:15)
    at Page.goto (D:\web\myblog\puppeteer\node_modules\puppeteer\lib\Page.js:674:49)
    at Page.<anonymous> (D:\web\myblog\puppeteer\node_modules\puppeteer\lib\helper.js:112:23)
    at Browser.goto (D:\web\myblog\puppeteer\src\douban\browser.js:36:18)
    at process._tickCallback (internal/process/next_tick.js:68:7)
```


- `Uncaught TypeError: Converting circular structure to JSON`

- [TypeError: Converting circular structure to JSON](https://stackoverflow.com/questions/4816099/chrome-sendrequest-error-typeerror-converting-circular-structure-to-json)
- [JSON.stringify出现 “Converting circular structure to JSON”](https://www.oecom.cn/json-stringify-error/)

> 对象中存在循环引用

```js
var a = {};
a.b = a;// 循环引用
// var data = data.data.fields 
```

use [json-stringify-safe](https://www.npmjs.com/package/json-stringify-safe)


- `Error: Execution context was destroyed, most likely because of a navigation.`