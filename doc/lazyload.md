

## 初始装载

```
<img class="lazy" data-src="img/example.jpg" width="640" height="480">

$(function() {
    $("img.lazy").lazyload(option);
});

```

## option配置

```
{
    effect : "fadeIn", //效果
    threshold : 200, //阀值
    placeholder : "img/grey.gif", // 占位符
    event : "click", // 事件触发
}
```
