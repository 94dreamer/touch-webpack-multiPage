/**
 * Created by zhouzhen on 2017/2/17.
 */
// require('../css/home/v1.0.0.scss');
import '../css/home/v1.0.0.scss';
console.log('home.js');
import Swipe from './lib/swipe';
// window.mySwipe = Swipe(document.getElementById('slider'));
// $('#slider').Swipe().data('Swipe');
var homeInit = {
  slider: function () {
    window.mySwipe = new Swipe(document.getElementById('slider'), {
      startSlide: 0,//开始坐标
      speed: 400,//transition速度
      //auto: 3000,//自动幻灯片的速度
      auto: 0,//自动幻灯片的速度
      continuous: false,//幻灯片头尾连续
      disableScroll: false,//禁止触摸滚动
      stopPropagation: false,//阻止冒泡
      callback: function (index, elem) {
        console.log(index)
        if (slideBtn && slideBtn.length) {
          slideBtn.removeClass().eq(index).attr("class", "current")
        }
      },//在幻灯片更改时回调
      transitionEnd: function (index, elem) {
      }//在幻灯片transition后回调
    });

    var slideBtn = $(".slider-control button");
    $(".slider-control").on("click", "button", function () {
      mySwipe.slide(slideBtn.index(this));
    });
  },
  domClick: function () {
    $(".show-more-btn").on("click",function () {

    });
  },
  init: function () {
    this.slider()
  }
};

$(function () {
  homeInit.init();
});
