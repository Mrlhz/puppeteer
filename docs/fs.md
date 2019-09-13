# fs（文件系统）

- [fs-文件系统](http://nodejs.cn/api/fs.html)
- [Node.js FS模块方法速查](https://www.cnblogs.com/datiangou/p/10112829.html)


## 常用方法

### 测试

- 访问权限测试 `fs.access(path[, mode], callback)` 测试是否可以访问某个路径。不建议`fs.open(), fs.readFile() or fs.writeFile()`调用前，调用`fs.access`去检查
- 测试路径是否存在 `fs.exists(path, callback)`， 不建议`fs.open()`, `fs.readFile() or fs.writeFile()`调用前，调用`fs.exists`去检测文件是否存在



### 流操作

操作 | 方法
---|---
创建可读流 | fs.createReadStream(path[, options])
创建可写流 | fs.createWriteStream(path[, options])


### 文件夹操作

操作 | 方法
---|---
创建文件夹 | fs.mkdir(path[, options], callback)
删除目录 | fs.rmdir(path, callback)
创建临时文件夹 | fs.mkdtemp(prefix[, options], callback)
读取文件夹 | fs.readdir(path[, options], callback)


### 文件操作

操作 | 方法
---|---
打开文件 | fs.open(path[, flags[, mode]], callback)
读取文件 | fs.read(fd, buffer, offset, length, position, callback)
读取文件 | fs.readFile(path[, options], callback)
重命名文件 | `fs.rename(oldPath, newPath, callback)`
读取文件信息 | fs.stat(path[, options], callback)
删除文件 | fs.unlink(path, callback)
停止监控文件 | fs.unwatchFile(filename[, listener])
修改时间 | fs.utimes(path, atime, mtime, callback)
监控文件变化 | fs.watch(filename, options)
关闭文件 | fs.close(fd, callback)
追加文件 | fs.appendFile(path, data[, options], callback)
改变文件模式 | fs.chmod(path, mode, callback)
改变文件所属 | fs.chown(path, uid, gid, callback)
复制文件 | fs.copyFile(fs.copyFile(src, dest[, flags], callback))
写文件 | fs.write(fd, buffer[, offset[, length[, position]]], callback)
写文件 | fs.write(fd, string[, position[, encoding]], callback)
写文件 | fs.writeFile(file, data[, options], callback)


### 其他

操作 | 方法
---|---
fs常量 | fs.constants


### 使用

```js
fs.readdir(__dirname, (e, dir) => {
  console.log(dir);
})
console.log(fs.lstatSync(__dirname).isDirectory());



let p = 'D:\\web\\puppeteer\\screenshot.png'

fs.stat(p, (err, srats) => {
  console.log(err, srats)
})
```