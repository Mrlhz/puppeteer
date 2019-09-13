# 


### 选影视
`https://movie.douban.com/tag/#/`


`https://movie.douban.com/j/search_tags?type=movie&source=index`

```js
{"tags":["热门","最新","豆瓣高分","冷门佳片","华语","欧美","韩国","日本"]}
```

`https://movie.douban.com/j/search_subjects?type=tv&tag=热门&page_limit=50&page_start=0`

```json


```


### 最近热门电影

> type

`https://movie.douban.com/j/search_tags?type=tv&source=index`

```js
{"tags":["热门","国产剧","综艺","美剧","日剧","韩剧","日本动画","纪录片"]}
```

`https://movie.douban.com/j/search_subjects?type=movie&tag=热门&page_limit=50&page_start=0`

```js
{
"subjects": [
    {
    "rate": "8.7",
    "cover_x": 1500,
    "title": "寄生虫",
    "url": "https://movie.douban.com/subject/27010768/",
    "playable": false,
    "cover": "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2561439800.webp",
    "id": "27010768",
    "cover_y": 2138,
    "is_new": false
    },
    {
    "rate": "7.9",
    "cover_x": 3600,
    "title": "疾速备战",
    "url": "https://movie.douban.com/subject/26909790/",
    "playable": false,
    "cover": "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2551393832.webp",
    "id": "26909790",
    "cover_y": 5550,
    "is_new": false
    }
    ...
  ]
}
```

> page_limit 最多返回500items
#### 按热度排序 
`https://movie.douban.com/j/search_subjects?type=tv&tag=国产剧&sort=recommend&page_limit=20&page_start=0`

#### 按时间排序  
`https://movie.douban.com/j/search_subjects?type=tv&tag=国产剧&sort=time&page_limit=20&page_start=0`

#### 按评价排序
`https://movie.douban.com/j/search_subjects?type=tv&tag=国产剧&sort=rank&page_limit=20&page_start=0`




### 豆瓣读书

搜索提示 q
`https://book.douban.com/j/subject_suggest?q=javascript`
`https://book.douban.com/j/subject_suggest?q=python`


http://learning.happymmall.com/



### 影讯API合集

- [影讯API合集](https://www.juhe.cn/docs/api/id/42)


名称	| 类型	| 说明
---|---|---
error_code	     | int	     |  返回码
reason	         | string	   |  返回说明
result	         | -	       |  返回结果集
movieid	         | string	   |  影片唯一标识ID
actors	         | string	   |  影片的演员列表。
also_known_as	   | string	   |  影片的其它名称。
country	         | string	   |  影片的拍摄国家。
directors	       | string	   |  影片的导演列表。
film_locations	 | string	   |  影片的拍摄地。
genres	         | string	   |  影片的分类。（如：戏剧，战争）
language	       | string	   |  影片的对白使用的语言。
plot_simple	     | String	   |  影片的剧情概要。
poster	         | String	   |  影片的海报。
rated	           | String	   |  影片的分类与评级。
rating	         | string	   |  影片的得分。
rating_count	   | string	   |  影片的评分人数。
release_date	   | Int	     |  影片的上映时间。
runtime	         | string	   |  影片的持续时间。
title	           | string	   |  影片的名称。
type	           | string	   |  影片类型.
writers	         | string	   |  影片的编剧列表。
year	           | Int	     |  影片的拍摄年代。