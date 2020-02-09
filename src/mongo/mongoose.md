- https://www.jianshu.com/p/554a5bf67b31


### 查询条件

条件操作符 | 含义 | 例子
---|---|---
$or　　　　    |  或关系
$nor　　　     |  或关系取反
$gt　　　　    |  大于
$gte　　　     |  大于等于
$lt　　　　    |  小于
$lte　　　     |  小于等于
$ne            |  不等于
$in            |  在多个值范围内
$nin           |  不在多个值范围内 | `db.bookbriefs.find({tag:{ $nin : ['编程', '经典', '随笔']} })` 不包含
$all           |  匹配数组中多个值
$regex　　     |  正则，用于模糊查询
$size　　　    |  匹配数组大小  | `db.bookbriefs.find({tag:{ $size : 5} })` 不能与其它的查询条件组合使用
$maxDistance　| 　范围查询，距离（基于LBS）
$mod　　       |  取模运算
$near　　　    |  邻域查询，查询附近的位置（基于LBS）
$exists　　    |  字段是否存在 | `db.booktags.find({ id: {$exists:false} })`
$elemMatch     |  匹配内数组内的元素
$within　　    |  范围查询（基于LBS）
$box　　　     |  范围查询，矩形范围（基于LBS）
$center        |  范围醒询，圆形范围（基于LBS）
$centerSphere　|  范围查询，球形范围（基于LBS）
$slice　　　　 |  查询字段集合中的元素（比如从第几个之后，第N到第M个元素）


### skip和limit语句

例如跳过3条记录查询其余记录的最前面5条
```js
db.bookbriefs.find({}).skip(3).limit(5)
```

### 填充对象

- 1、深层属性查询


### mongodb中查询返回指定字段

```js
// 只输出id和title字段，第一个参数为查询条件，空代表查询所有
db.news.find( {}, { id: 1, title: 1 } )
// 如果需要输出的字段比较多，不想要某个字段，可以用排除字段的方法
// 不输出内容字段，其它字段都输出
db.news.find( {}, {content: 0 } )
```
