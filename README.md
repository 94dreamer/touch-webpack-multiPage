## 多页面触屏开发

* [触屏开发规范及优化思路](https://github.com/94dreamer/Note/tree/master/触屏开发规范及优化思路)
* [开发错误处理记录](./doc/Error.md)
* [图片懒加载load使用](./doc/lazyload.md)
* [小型swipe使用](./doc/swipe.md)
* [移动端事件总结](./doc/移动端事件.md)


### 如何使用

* `watch` 监听文件改变,提交时需要停止,并执行 `npm run buid` 或者 `npm run online`
* `npm run build` 执行外测环境提交代码，代码会被压缩。
* `npm run online` 执行线上环境提交代码，代码会被压缩。
* `npm run dev` 执行开发环境，然后打开`localhost:8080/view/`或者执行`npm run browser`,就可以了。
* `npm run browser` 使用打开dev浏览器。
* `npm run eslint` 使用eslint检查代码。
* `npm run clean` 清空编译文件！！慎用

### 切图

1. 把除了font-size之外的地方使用的px转换成rem。然后在使用了font-size的地方，通过[data-dpr="2"]和[data-dpr="3"]重置font-size的值。
2. 链家网手机版就遇到了这个问题，采取的方案是：对于地图进行zoom，比例为dpr。scale当时没试过，理论上可以，但是是从中心点开始，需要transform-origin: 0 0 0。还是zoom简单，不用写前缀，一个属性搞定。
3. 可以手动设置一下 viewport 不缩放， <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no"> 就可以了。但是会有个问题，1px 的线不细了

### 发布（基于表的静态资源映射系统）

以前的时间戳控制版本号可以，但是不是最好的选择（如果文件名基于内容而定，而且文件名是唯一的，HTTP 报头会建议在所有可能的地方（CDN，ISP，网络设备，网页浏览器）存储一份该文件的副本。）

配合html-webpack-plugin自动引入 或者是 assets-webpack-plugin ，生成了 assets.json文件让php服务器读取脚本配置文件，吐到smarty模版变量。
> 优点

```
配置超长时间的本地缓存 —— 节省带宽，提高性能
采用内容摘要作为缓存更新依据 —— 精确的缓存控制
更资源发布路径实现非覆盖式发布 —— 平滑升级
先发静态 再发布html。
```

* php实现的关键代码是 `file_get_contents()` 函数


> 突然想到会有一个问题 assets.json放在php目录下 不能随时提交且绑定host走静态资源

解决办法：

* 服务器加个url参数 assets=dev ,或者让php服务器判断外测或者线上环境变量，读取 assets.dev.json 的配置，这份配置的脚本不带任何版本号，否则线上默认读取 assets.json。
* fidder正则匹配来代理

仍然没解决的问题就是 img图片的md5

### 开发

- search组件还可以优化 不请求
- 各种统计脚本还可以优化

