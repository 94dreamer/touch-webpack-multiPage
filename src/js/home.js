/**
 * Created by zhouzhen on 2017/2/17.
 */
// require('../css/home/v1.0.0.scss');
import '../css/home/v1.0.0.scss';
console.log('home.js');
import Swipe from './lib/swipe';
import Search from '../components/search/Search';


var homeInit = {
  slider: function () {
    // window.mySwipe = Swipe(document.getElementById('slider'));
    // $('#slider').Swipe().data('Swipe');
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
    /*顶部入口显示隐藏*/
    $(".show-more-btn").on("click", function () {
      $(".entry-nav-bar").removeClass("list-hide");
    });
    $(".hide-more-btn").on("click", function () {
      $(".entry-nav-bar").addClass("list-hide");
    });
    /*显示浮层*/
    var titleChooseBox=$(".title-choose-box");
    $(".show-btn").on("click",function () {
      titleChooseBox.hasClass("open")?titleChooseBox.removeClass("open"):titleChooseBox.addClass("open");
    });
    /*直播房源切换*/
    $("#house-tab").on("click", "div", function () {
      if ($(this).hasClass("active")) {
        return false;
      }
      $(".live-house-list[data-tabid=2] img[data-src]").trigger("sporty");
      var dataId = $(this).data("tab");
      $(this).addClass("active").siblings("div").removeClass("active").siblings("i").attr("class", (dataId == 1 ? "left" : "right") + "-active");
      $(".live-house-list[data-tabid=" + dataId + "]").addClass("active").siblings(".live-house-list").removeClass("active");
      $(".live-house-box .watch-more-btn[data-tabid=" + dataId + "]").removeClass("dn").siblings(".watch-more-btn").addClass("dn");
    });
    /*热门筛选*/
    $(".hot-choose-list").on("click", ".show-choose-btn", function () {
      if ($(this).hasClass("open")) {
        $(this).removeClass("open")
        $(this).parent("li").removeClass("show-more");
      } else {
        $(this).addClass("open")
        $(this).parent("li").addClass("show-more");
      }
    })
  },
  imgLoad: function () {
    /*图片懒加载*/
    $("img[data-src]").lazyload({
      effect: "fadeIn",
      event:"scroll"
    });
  },
  init: function () {
    this.slider();
    this.domClick();
    this.imgLoad();
    Search();
    console.log(19808)
  }
};

$(function () {
  homeInit.init();
});
