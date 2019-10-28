
const data = [
  {name:'文件夹1',pid:0,id:1},
  {name:'文件夹2',pid:0,id:2},
  {name:'文件夹3',pid:0,id:3},
  {name:'文件夹1-1',pid:1,id:4},
  {name:'文件夹2-1',pid:2,id:5},
  {name:'文件1',pid:1,id:10001},
  {name:'文件2',pid:1,id:10002},
  {name:'文件2-1',pid:2,id:10003},
  {name:'文件2-2',pid:2,id:10004},
  {name:'文件1-1-1',pid:4,id:10005},
  {name:'文件2-1-1',pid:5,id:10006}
]

const treeMapList = data.reduce((acc, cur) => {
  acc[ cur['id'] ] = cur
  return acc
}, {})

console.log(treeMapList);


const result = data.reduce((acc, cur) => {
  let pid = cur.pid
  let parent = treeMapList[pid]
  if (parent) {
    parent.children ? parent.children.push(cur) : parent.children = [cur]
  } else if (pid === 0) {
    acc.push(cur)
  }

  return acc
}, [])


// console.log(result);