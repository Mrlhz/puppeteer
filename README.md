# Puppeteer 使用

- [Puppeteer](https://pptr.dev/)
- [Puppeteer v18.0.5](http://www.puppeteerjs.com/#?product=Puppeteer&version=v18.0.5)
- [PPuppeteer 中文文档](https://learnku.com/docs/puppeteer/3.1.0)
- [chromium官方下载网站](https://download-chromium.appspot.com/)
- [puppeteer 文档](https://pptr.dev/)
- [puppeteer 中文文档](https://zhaoqize.github.io/puppeteer-api-zh_CN)
- [爬虫利器 Puppeteer 实战](https://www.jianshu.com/p/a9a55c03f768)
- [puppeteer-cn](https://npm.taobao.org/package/puppeteer-cn)
- [awesome-puppeteer](https://github.com/transitive-bullshit/awesome-puppeteer/blob/master/readme.zh.md)
- [mongoose-doc-cn](https://github.com/ssshooter/mongoose-doc-cn)
- [mongoose 5.0 中文文档](https://cn.mongoosedoc.top/docs/guide.html)
- [快代理](https://www.kuaidaili.com/)
- [阿布云](https://www.abuyun.com/)
- [HTTP隧道 （动态版）NodeJS 接入指南](https://www.abuyun.com/http-proxy/dyn-manual-nodejs.html)
- [西刺免费代理IP](https://www.xicidaili.com/)

### 安装 Puppeteer

```shell
set PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1 # 阻止下载 Chromium, cmd下有效

# 或者可以这样干，只下载模块而不build
yarn add -D puppeteer --ignore-scripts

# 下载puppeteer & Chromium模块
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


### 目录

> 数据来源于网络整理，仅供学习。

- [爬取统计用区划代码和城乡划分代码](./src/CityParser/index.js)

```shell
# 修改配置，去掉注释
node src/CityParser/index.js
```
- [爬取豆瓣图书](./src/douban/books/index.js)

```sh
# 获取图书简介
node getBookListByTag.js
```
- [爬取豆瓣电影](./src/douban/movies/index.js)

```
node src/douban/movies/index.js
```

- 获取某个网页的一些数据

```sh
cd src/helper
# 修改getHtml
node getJSONFile.js
```
