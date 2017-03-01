

## 配置参数

```
startSlide: 0,//开始坐标

speed: 400,//transition速度

auto: 3000,//自动幻灯片的速度

continuous: true,//幻灯片头尾连续

disableScroll: false,//禁止触摸滚动

stopPropagation: false,//阻止冒泡

callback: function(index, elem) {},//在幻灯片更改时回调

```

## API方法

```
prev() 上一张

next() 下一张

getPos() 返回当前幻灯片的位置下标

getNumSlides() 返回幻灯片的总数

slide(index, duration) 跳转到指定索引下标的幻灯片 (duration: 更换过渡时间)

```