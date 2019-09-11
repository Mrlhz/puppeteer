# Puppeteer 使用

- [chromium官方下载网站](https://download-chromium.appspot.com/)
- [puppeteer 文档](https://pptr.dev/)
- [puppeteer 中文文档](https://zhaoqize.github.io/puppeteer-api-zh_CN)
- [爬虫利器 Puppeteer 实战](https://www.jianshu.com/p/a9a55c03f768)
- [puppeteer-cn](https://npm.taobao.org/package/puppeteer-cn)


### 安装 Puppeteer

```shell
set PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1 # 阻止下载 Chromium

# 或者可以这样干，只下载模块而不build
yarn add -D puppeteer --ignore-scripts

yarn add puppeteer -D

```

使用时
```js
const browser = await puppeteer.launch({
  // executablePath: 'D:/.../node_modules/puppeteer/.local-chromium/win64-662092/chrome-win/chrome.exe',
  executablePath: 'D:/.../Chromium_v692609/chrome-win/chrome.exe' // Chromium路径
});
```

科学上网手动[下载chromium](https://download-chromium.appspot.com/)

