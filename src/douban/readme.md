# 豆瓣爬虫


### 豆瓣图书标签

1. 获取标签分类

- `https://book.douban.com/tag/?view=type`
- `https://book.douban.com/tag/?view=cloud`

2. 根据标签获取图书 `https://book.douban.com/tag/[标签]?start=[0-980]&type=[T,R,S]`

- `https://book.douban.com/tag/小说`
- `https://book.douban.com/tag/小说?start=980&type=T`

- type  综合排序 T   按出版日期排序 R   按评价排序 S


### 获取图书详情

```js
1. getBookListByTag.js 获取 urls
2. getBookDetails.js 遍历urls，保存json数据
```


### 获取电影详情

```js
1. 获取 urls
2. getMovieDetails.js 遍历urls，保存json数据
3. 执行 index.js
```


> `getBookDetails.js` 和 `getMovieDetails.js` 除了处理html方法，几个参数不同，执行流程是一样的

> 豆瓣封IP，白天一分钟可以访问40次，晚上一分钟可以访问60次，超过限制次数就会封IP

- [爬虫项目需求分析](https://edu.csdn.net/notebook/python/week11/6.html)

### 图书ID变化

```
图书url有变动
https://book.douban.com/subject/3228470/ => redirect to  https://book.douban.com/subject/34912074/
https://book.douban.com/subject/30313503/ => redirect to https://book.douban.com/subject/26120130/
id change
```
