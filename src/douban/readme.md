# 豆瓣爬虫


### 豆瓣图书标签

1. 获取标签分类

- `https://book.douban.com/tag/?view=type`
- `https://book.douban.com/tag/?view=cloud`

2. 根据标签获取图书 `https://book.douban.com/tag/[标签]?start=[0-980]&type=[T,R,S]`

- `https://book.douban.com/tag/小说`
- `https://book.douban.com/tag/小说?start=980&type=T`

- type  综合排序 T   按出版日期排序 R   按评价排序 S


### 

`https://movie.douban.com/j/new_search_subjects?sort=S&range=0,10&tags=电影&start=0`