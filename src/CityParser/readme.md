
- [[数据][json格式] 2016年统计用区划代码和城乡划分代码](https://blog.csdn.net/isea533/article/details/78862295)
- [国家统计局统计用区划代码和城乡划分代码---爬虫、详细分析](https://blog.csdn.net/dta0502/article/details/82024462)
- [](https://www.sl-swkj.com/api/wx/region/list?pid=0&tdsourcetag=s_pctim_aiomsg)

```js

```

1. 获取省份list `getProvince.js`

![2018年统计用区划代码和城乡划分代码(截止2018年10月31日)](../../images/2018年统计用区划代码和城乡划分代码(截止2018年10月31日).png)


2. 获取某个省份 `index.js`

![2018年统计用区划代码和城乡划分代码(截止2018年10月31日)](../../images/getBJAreaData.png)

```js

// http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/11.html
// http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/11/1101.html
// http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/11/01/110101.html
// http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/11/01/01/110101001.html
```

- 北京 1+1+16+336 个页面，每个页面延迟5s，共耗时2291147.657ms
- 天津 1+1+16+306 个页面，每个页面延迟5s，共耗时2523369.158ms
- 广东 1+21+200+2597 个页面，每个页面延迟4s，共耗时

- 天津 5902
- 北京 7507