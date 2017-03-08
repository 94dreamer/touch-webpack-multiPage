/**
 * 主页和列表的搜索交互
 *
 * Edited by zhouzhen on 2017/3/6.
 * Created by yangtong on 15/12/4.
 */
import './search.scss';

export default function Search() {

  function bodyScroll(e) {                        //阻止touchmove ??
    e.preventDefault();
  }

  function stopTouchMove() {
    document.addEventListener('touchmove', bodyScroll, false);
  }

  function releaseTouchMove() {
    document.removeEventListener('touchmove', bodyScroll, false);
  }

  let timer = null;

  function showLayer() {    //显示
    timer && clearTimeout(timer);
    $('body,html').addClass('ov');
    $('.body_bg').show().removeClass('slideOutRight').addClass('slideInRight animated');
    var boxH = $(window).height() - $('.search_input').height() - $('.tab_part').height();
    $('.scroller_height').height(boxH);
  }

  function hideLayer() {   //隐藏
    timer && clearTimeout(timer);
    $('.body_bg').removeClass('slideInRight').addClass('slideOutRight');
    timer = setTimeout(function () {
      $('.body_bg').hide();
      $('body,html').removeClass('ov');
      clearTimeout(timer);
      timer = null;
    }, 400)
  }

  $(".home-search-box,.search-select-input").on("click", function () {//主页和列表页都有input
    showLayer();
    //$('#comm_search').trigger('focus');
    if ($('#comm_search').val().trim().length) {
      $('.i_closeBtn').show();
    } else {
      $('.i_closeBtn').hide();
    }
    var searchParamTitle = window.searchParam_title;                    //获取哪个切签被选中，页面隐藏域
    var redBg = $(".red_bg");
    var liW = $(".pa>ul>li").width();                        //标签宽度
    var colorWhite = $('.pa>ul>li');                        //应被选中的签
    var historyBox = $('.history_part');                        //历史记录
    var historySH = window.localStorage.getItem('historySH');                        //获取缓存的历史记录
    switch (searchParamTitle) {
      case '租房' :
        redBg.show().css('left', liW);
        redBg.removeClass('borderRadiusRight').removeClass('borderRadiusLeft');
        colorWhite.find('a').removeClass('colorWhite');
        colorWhite.eq(1).find('a').addClass('colorWhite');
        Esf_touch.shType = 'rent';
        if (historySH && historySH != '') {                        //有缓存的记录，展开对应的及时记录块
          historyBox.find('div').hide().eq(1).show();
        }
        break;
      case '小区房价' :
        redBg.show().css('left', liW * 2);
        redBg.removeClass('borderRadiusRight').removeClass('borderRadiusLeft');
        colorWhite.find('a').removeClass('colorWhite');
        colorWhite.eq(2).find('a').addClass('colorWhite');
        Esf_touch.shType = 'home';
        if (historySH && historySH != '') {
          historyBox.find('div').hide().eq(2).show();
        }
        break;
      case '置业专家' :
        redBg.show().css('left', liW * 3);
        redBg.removeClass('borderRadiusLeft').addClass('borderRadiusRight');
        colorWhite.find('a').removeClass('colorWhite');
        colorWhite.eq(3).find('a').addClass('colorWhite');
        Esf_touch.shType = 'agent';
        if (historySH && historySH != '') {
          historyBox.find('div').hide().eq(3).show();
        }
        break;
      default :
        redBg.show().css('left', 0);
        redBg.addClass('borderRadiusLeft').removeClass('borderRadiusRight');
        colorWhite.find('a').removeClass('colorWhite');
        colorWhite.eq(0).find('a').addClass('colorWhite');
        Esf_touch.shType = 'sale';
        if (historySH && historySH != '') {
          historyBox.find('div').hide().eq(0).show();
        }
    }
    if (window.localStorage.getItem('historySH')) {
      var data = JSON.parse(window.localStorage.getItem('historySH'));
      var historyPart = $('.history_part');
      for (var name in data) {                        //循环历史记录的键值，拼成html
        var html = '';
        $.each(data[name], function (i, data) {
          var str = '<li>' + '<a href="' + data["href"] + '">' + data["info"] + '</a>' + '</li>';
          html += str;
        });
        historyPart.find('.history_' + name).find('ul').html(html);                        //添加到相应的块中
        switch (name) {
          case 'sale':
            $('.history_sale').find('.clean_result').css('display', 'block');
            break;
          case 'rent':
            $('.history_rent').find('.clean_result').css('display', 'block');
            break;
          case 'home':
            $('.history_home').find('.clean_result').css('display', 'block');
            break;
          case 'agent':
            $('.history_agent').find('.clean_result').css('display', 'block');
            break;
        }
      }
      $('.search_result_part').hide();
      historyPart.show();
    }
    stopTouchMove();//阻止浮层下面主体页面的touchmove ??
    $('#comm_search').get(0).click();
    $('#comm_search').trigger('focus');
  });
  /*$('.search-select-input').on('click', function () {
   if (Esf_touch.init.searchInput.val() == "") {
   $('.recommend_tab').show();
   $('.clean_result').css('display', 'block');
   }
   });*/

  /**
   * 关闭搜索层，并打开touchmove
   * */
  $('#closeSearch').on('click', function () {
    //$('.body_bg').animate({left: '120%'}, 300, 'ease-in-out');
    $('#comm_search').get(0).blur();
    hideLayer();
    releaseTouchMove();
  });
  /**
   * 搜索结果点击每条时的相应事件
   * */
  $(".search_result_part").on("click", 'div ul li a', function (e) {
    var tt = $(this), shHref = tt.attr('href'), shVal = tt.find('em').eq(0).text(), obj = {}, dataName = tt.attr('data-name');
    var shType = $(".pa>ul>li>a.colorWhite").attr("data-shtype");
    var typeData = "";
    var keyWord = dataName.replace(/二手房/, '');
    try {
      window.localStorage.setItem('keyWord', keyWord);
    } catch (e) {
      console.error(e.message)
    }
    switch (shType) {
      case 'sale' :
        typeData = 'sale';
        break;
      case 'rent' :
        typeData = 'rent';
        break;
      case 'home' :
        typeData = 'home';
        break;
      case 'agent' :
        typeData = 'agent';
        break;
    }
    if (window.localStorage) {
      if (window.localStorage.getItem('historySH')) {                     //能获取到本地缓存
        var getHistory = window.localStorage.getItem('historySH');
        var strHistory = JSON.parse(getHistory);
        if (strHistory[typeData] === undefined) {                       //json里没有当前标签的数据
          strHistory[typeData] = [{info: shVal, href: shHref}];                       //吧数据存进去
        } else {
          var sameIndex = "";
          $.each(strHistory[typeData], function (index, val) {
            if (val["info"] === shVal) {
              sameIndex = index;
            }
          });
          if (sameIndex !== "") {
            var sameDate = strHistory[typeData].splice(sameIndex, 1);
            strHistory[typeData].unshift(sameDate[0]);
          } else {
            strHistory[typeData].unshift({info: shVal, href: shHref});
          }
        }
        if (strHistory[typeData].length > 10) {
          strHistory[typeData] = strHistory[typeData].slice(0, 10);
        }
        var tranJSON = JSON.stringify(strHistory);
        try {
          window.localStorage.setItem('historySH', tranJSON);
        } catch (e) {
          console.error(e.message)
        }
        //console.log(tranJSON);
      } else {                        //取不到缓存，加缓存
        obj[typeData] = [
          {
            info: shVal,
            href: shHref
          }
        ];
        var objJSON = JSON.stringify(obj);
        try {
          window.localStorage.setItem('historySH', objJSON);
        } catch (e) {
          console.error(e.message)
        }
        //return false;
      }
    }
  });
  /**
   * 搜索相关方法
   * */
  var Esf_touch = {
    shType: $(".pa>ul>li>a.colorWhite").attr("data-shtype"),
    init: {
      searchInput: $("#comm_search"),                        //搜索框
      cleanResult: $('.clean_result'),                        //清除结果按钮
      searchDownList: '<ul>' +                        //搜索中展示结果的模板
      '<%$.each(data,function(i,data){%>' +
      '<%if(data.type=="block"){%>' +//类型为板块 值为区域+板块
      '<li>' +
      '<a href="' + window.currenturl + '<%=data.url%>" class="plate" data-name="<%=data.name%>" district-name="<%=data.districtName%>" block-name="<%=data.highlight%>">' +
      '<%if(Esf_touch.shType == "sale"){%>' +
      '<%if(data.salecount != "" && data.salecount !== undefined){%>' +
      '<em><%:=data.districtName%>-<%:=data.highlight%></em>' + '<em class="tr">在售<i><%=data.salecount%></i>套</em>' +
      '<%}else{%>' +
      '<em><%:=data.districtName%>-<%:=data.highlight%></em>' + '<em class="tr"></em>' +
      '<%}%>' +
      '<%}else if(Esf_touch.shType == "rent"){%>' +
      '<%if(data.rentcount != "" && data.rentcount !== undefined){%>' +
      '<em><%:=data.districtName%>-<%:=data.highlight%></em>' + '<em class="tr">在租<i><%=data.rentcount%></i>套</em>' +
      '<%}%>' +
      '<%}else if(Esf_touch.shType == "home"){%>' +
      '<%if(data.homecount != "" && data.homecount !== undefined){%>' +
      '<em><%:=data.districtName%>-<%:=data.highlight%></em>' + '<em class="tr">小区<i><%=data.homecount%></i>个</em>' +
      '<%}else{%>' +
      '<em><%:=data.districtName%>-<%:=data.highlight%></em>' + '<em class="tr"></em>' +
      '<%}%>' +
      '<%}else if(Esf_touch.shType == "agent"){%>' +
      '<%if(data.agentcount != "" && data.agentcount !== undefined){%>' +
      '<em><%:=data.districtName%>-<%:=data.highlight%></em>' + '<em class="tr"><i><%=data.agentcount%></i>位</em>' +
      '<%}%>' +
      '<%}%>' +
      '</a>' +
      '</li>' +
      '<%}else if(data.type=="home" || data.type == "homeothername"){%>' + //类型为小区
      '<li>' +
      '<a href="' + window.currenturl + '<%=data.url%>" class="detail" data-name="<%=data.name%>" district-name="<%=data.districtName%>" block-name="<%=data.highlight%>">' + '<em><%:=data.highlight%></em>' +
      '<%if(Esf_touch.shType == "sale"){%>' +
      '<%if(data.salecount != "" && data.salecount !== undefined){%>' +
      '<em class="tr">在售<i><%=data.salecount%></i>套</em>' +
      '<%}%>' +
      '<%}else if(Esf_touch.shType == "rent"){%>' +
      '<%if(data.rentcount != "" && data.rentcount !== undefined){%>' +
      '<em class="tr">在租<i><%=data.rentcount%></i>套</em>' +
      '<%}%>' +
      '<%}else if(Esf_touch.shType == "home"){%>' +
      '<%if(data.avgprice != "" && data.avgprice !== undefined){%>' +
      '<em class="tr">均价<i><%=data.avgprice%></i>元/平</em>' +
      '<%}%>' +
      '<%}else if(Esf_touch.shType == "agent"){%>' +
      '<%if(data.agentcount != "" && data.agentcount !== undefined){%>' +
      '<em class="tr"><i><%=data.agentcount%></i>位</em>' +
      '<%}%>' +
      '<%}%>' +
      '</a>' +
      '</li>' +
      '<%}else if(data.type=="district"){%>' + //类型区域 值为区域
      '<li>' +
      '<a href="' + window.currenturl + '<%=data.url%>" class="area" data-name="<%=data.name%>" district-name="<%=data.districtName%>" block-name="<%=data.highlight%>">' + '<em><%:=data.highlight%></em>' +
      '<%if(Esf_touch.shType == "sale"){%>' +
      '<%if(data.salecount != "" && data.salecount !== undefined){%>' +
      '<em class="tr">在售<i><%=data.salecount%></i>套</em>' +
      '<%}%>' +
      '<%}else if(Esf_touch.shType == "rent"){%>' +
      '<%if(data.rentcount != "" && data.rentcount !== undefined){%>' +
      '<em class="tr">在租<i><%=data.rentcount%></i>套</em>' +
      '<%}%>' +
      '<%}else if(Esf_touch.shType == "home"){%>' +
      '<%if(data.homecount != "" && data.homecount !== undefined){%>' +
      '<em class="tr">小区<i><%=data.homecount%></i>个</em>' +
      '<%}%>' +
      '<%}else if(Esf_touch.shType == "agent"){%>' +
      '<%if(data.agentcount != "" && data.homecount !== undefined){%>' +
      '<em class="tr"><i><%=data.agentcount%></i>位</em>' +
      '<%}%>' +
      '<%}%>' +
      '</a>' +
      '</li>' +
      '<%}else if(data.type=="tag"){%>' + //类型标签
      '<%if(Esf_touch.shType == "sale"){%>' +
      '<li>' +
      '   <%if(data.salecount != "" && data.salecount !== undefined){%>' +
      '<a href="' + window.currenturl + '<%=data.url%>" class="subway" data-name="<%=data.name%>" district-name="<%=data.districtName%>" block-name="<%=data.highlight%>">' +
      '<em><%:=data.highlight%></em>' +
      '<em class="tr">在售<i><%=data.salecount%></i>套</em>' +
      '</a>' +
      '<%}%>' +
      '</li>' +
      '<%}else{%>' +
      '<li style="display: none">' +
      '<a href="javascript:void(0);" style="display: none">' +
      '</li>' +
      '<%}%>' +
      '<%}else{%>' +
      '<li>' +
      '<a href="' + window.currenturl + '<%=data.url%>" class="detail" data-name="<%=data.name%>" district-name="<%=data.districtName%>" block-name="<%=data.highlight%>">' + '<em><%:=data.name%></em>' +
      '<%if(Esf_touch.shType == "sale"){%>' +
      '<%if(data.salecount != "" && data.salecount !== undefined){%>' +
      '<em class="tr">在售<i><%=data.salecount%></i>套</em>' +
      '<%}%>' +
      '<%}else if(Esf_touch.shType == "rent"){%>' +
      '<%if(data.rentcount != "" && data.rentcount !== undefined){%>' +
      '<em class="tr">在租<i><%=data.rentcount%></i>套</em>' +
      '<%}%>' +
      '<%}else if(Esf_touch.shType == "home"){%>' +
      '<%if(data.avgprice != "" && data.avgprice !== undefined){%>' +
      '<em class="tr">均价<i><%=data.avgprice%></i>元/平</em>' +
      '<%}%>' +
      '<%}else if(Esf_touch.shType == "agent"){%>' +
      '<%if(data.agentcount != "" && data.agentcount !== undefined){%>' +
      '<em class="tr"><i><%=data.agentcount%></i>位</em>' +
      '<%}%>' +
      '<%}%>' +
      '</a>' +
      '<p><%=data.districtName%><%:=data.highlight%></p>' +
      '</li>' +
      '<%}%>' +
      '<%});%>' +
      '</ul>',
      //历史搜索模板
      historyDownList: '<ul>' +
      '<%$.each(data,function(i,data){%>' +
      '<li>' +
      '<a href="' + window.currenturl + '<%=data.url%>">' +
      '<%if(Esf_touch.shType == "sale"){%>' +
      '<em><%:=data.name%></em>' +
      '<%}else if(Esf_touch.shType == "rent"){%>' +
      '<em><%:=data.name%></em>' +
      '<%}else if(Esf_touch.shType == "home"){%>' +
      '<em><%:=data.name%></em>' +
      '<%}else if(Esf_touch.shType == "agent"){%>' +
      '<em><%:=data.name%></em>' +
      '<%}%>' +
      '</a>' +
      '</li>' +
      '<%});%>' +
      '</ul>',
      //请求地址，搜索请求的接口地址
      shUrl: 'http://' + window.curcityEn + '.esf.leju.com/di/search/',
      //关键字
      lastKeyword: null
    },
    /**
     * 搜索初始化
     */
    initSH: function (e) {
      $('#comm_search').on('input', function () {                       //模糊搜索
        $(".recommend_tab").hide();
        $('.i_closeBtn').show();
        var dbfn = Esf_touch.debounce(Esf_touch.postSH, 300);
        $(this).off('input').on('input', dbfn);
        dbfn();
        //return false;
      });
      $('.search_btn').on('click', Esf_touch.jumpSH);                       //点击“搜索”按钮时传值的精准搜索
    },
    /**
     * 添加返回结果
     */
    renderSH: function (res) {
      var html = baidu.template(Esf_touch.init.searchDownList, res);
      var shBox = $(".search_result_part>div");
      var s1, s2, s3, s4;
      Esf_touch.init.cleanResult.hide();
      switch (Esf_touch.shType) {
        case 'sale' :
          shBox.eq(0).html(html);
          $('.scroller_height').hide();
          $('#scroller').show();
          window.setTimeout(function () {
            if (s1) {
              s1.refresh();
              return
            }
            s1 = new IScroll("#scroller", {
              hScrollbar: false,
              vScrollbar: false,
              click: true
            });
          }, 100);
          break;
        case 'rent' :
          shBox.eq(1).html(html);
          $('.scroller_height').hide();
          $('#scroller2').show();
          window.setTimeout(function () {
            if (s2) {
              s2.refresh();
              return
            }
            s2 = new IScroll("#scroller2", {
              hScrollbar: false,
              vScrollbar: false,
              click: true
            });
          }, 100)
          break;
        case 'home' :
          shBox.eq(2).html(html);
          $('.scroller_height').hide();
          $('#scroller3').show();
          window.setTimeout(function () {
            if (s3) {
              s3.refresh();
              return
            }
            s3 = new IScroll("#scroller3", {
              hScrollbar: false,
              vScrollbar: false,
              click: true
            });
          }, 100)
          break;
        case 'agent' :
          shBox.eq(3).html(html);
          $('.scroller_height').hide();
          $('#scroller4').show();
          window.setTimeout(function () {
            if (s4) {
              s4.refresh();
              return
            }
            s4 = new IScroll("#scroller4", {
              hScrollbar: false,
              vScrollbar: false,
              click: true
            });
          }, 100)
          break;
      }
    },
    /**
     * 搜索请求
     * @return {[type]} [description]
     */
    postSH: function () {
      var tt = Esf_touch.init.searchInput,                       //搜索的输入框
        kw = tt.val(),
        searchBox = $('.search_result_part'),                       //显示返回结果的模块
        postD = {
          uri: 'touch',
          keyword: kw,
          type: Esf_touch.shType                       //当前切签的选中项，“二手房、租房、小区房价、置业专家”
        };
      if (postD.keyword && postD.keyword != '') {                       //输入框中有值才发请求
        $(".history_part").hide();
        $(".search_result_part").show();
        $('.clean_result').hide();
        Esf_touch.postData(Esf_touch.init.shUrl, postD, Esf_touch.renderSH);
      }
      if (postD.keyword == "" && searchBox.css('display') == 'block') {                       //在搜索过程中，完全清除掉了输入框中的文字，但是还在搜索的时候
        searchBox.hide().find('ul').html('');
        var hisSH = localStorage.getItem('historySH');
        if (hisSH && hisSH != '') {
          $('history_part').show();
        }
      }
      Esf_touch.init.lastKeyword = kw;                       //更新每次搜索关键字
    },
    /**
     * 防反跳
     * @param  {[type]} func      [回调]
     * @param  {[type]} wait      [延迟]
     * @param  {[type]} immediate [立即执行]
     * @return {[type]}           [description]
     */
    debounce: function (func, wait, immediate) {
      var timeout, args, context, timestamp, result;
      var later = function () {
        var last = new Date().getTime() - timestamp;
        if (last < wait && last >= 0) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) {
            result = func.apply(context, args);
            if (!timeout) context = args = null;
          }
        }
      };
      return function () {
        context = this;
        args = arguments;
        timestamp = new Date().getTime();
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
          result = func.apply(context, args);
          context = args = null;
        }
        return result;
      };
    },
    /**
     * 搜索跳转判断
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    jumpSH: function (e) {
      var url = window.currenturl,
        keyWord = $('#comm_search').val(),
        prefix = '';
      try {
        window.localStorage.setItem('keyWord', keyWord);
      } catch (e) {
        console.error(e.message);
      }
      switch (Esf_touch.shType) {
        case 'sale' :                       //二手房
        case '100' :
        case '101' :
        case '102' :
          url += '/house/o';
          window.location.href = url + Esf_touch.init.searchInput.val();
          break;
        case '104' :
          prefix = '/' + window.curcity + '/house/x1-o';
          break;
        case 'rent' :                       //租房
        case '200' :
        case '201' :
        case '202' :
          url += '/house/i2-o';
          window.location.href = url + Esf_touch.init.searchInput.val();
          break;
        case '204' :
          prefix = '/' + window.curcity + '/house/x1-i2-o';
          break;
        case 'agent' :                       //置业专家
        case '400' :
        case '401' :
        case '402' :
          url += '/agent/o';
          window.location.href = url + Esf_touch.init.searchInput.val();
          break;
        case 'home' :                       //小区房价
        case '300' :
        case '301' :
        case '302' :
        case '303' :
        case '304' :
        case '305' :
        case '306' :
        case '307' :
        case '308' :
        case '309' :
          url += '/community/o';
          window.location.href = url + Esf_touch.init.searchInput.val();
          break;
        case '801' :
          prefix = '/' + window.curcity + '/house/t2-o';
          break;
        case '802' :
          prefix = '/' + window.curcity + '/house/i2-t2-o';
          break;
        case '804' :
          prefix = '/' + window.curcity + '/house/x1-t2-o';
          break;
        case '805' :
          prefix = '/' + window.curcity + '/house/x1-i2-t2-o';
          break;
        case '501' :
          prefix = '/' + window.curcity + '/house/t5-o';
          break;
        case '502' :
          prefix = '/' + window.curcity + '/house/i2-t5-o';
          break;
        case '504' :
          prefix = '/' + window.curcity + '/house/x1-t5-o';
          break;
        case '505' :
          prefix = '/' + window.curcity + '/house/x1-i2-t5-o';
          break;
        case '601' :
          prefix = '/' + window.curcity + '/house/t4-o';
          break;
        case '602' :
          prefix = '/' + window.curcity + '/house/i2-t4-o';
          break;
        case '604' :
          prefix = '/' + window.curcity + '/house/x1-t4-o';
          break;
        case '605' :
          prefix = '/' + window.curcity + '/house/x1-i2-t4-o';
          break;
        default :
          prefix = '/' + window.curcity + '/house/o';
      }
    },
    /**
     * ajax调取通用方法
     * @param  {[type]}   url     [请求地址]
     * @param  {[type]}   data    [请求数据]
     * @param  {Function} fn      [成功回调方法]
     * @param  {[type]}   noFn    [失败回调方法]
     * @param  {Boolean}  isAsync [是否异步，默认异步]
     * @return {[type]}           [同步情况下返回数据]
     */
    postData: function (url, data, fn, noFn, isAsync) {
      url += '?citycode=' + window.city + "&homeaddress=1&tag=1&callback=?";
      var returnData = {};
      $.getJSON(url, data, function (res) {
        var res = (typeof res == 'string') ? JSON.parse(res) : res;
        console.log(res);//接口返回信息
        if (res.code == 0) {
          fn ? fn(res) : false;
          if (!isAsync) {
            returnData = res;
          }
        } else {
          noFn ? noFn(res) : console.log("返回信息" + res.message);
        }
      });
      return returnData;
    },
    /**
     * 切签切换时重新请求展示数据
     * */
    changeTab: function () {
      $(".pa>ul>li>a").on("click", function () {
        var index = $(this).parent().index();                                           //索引值
        var redBg = $(".red_bg");                                                       //移动的红色北京块
        var liW = $(".pa>ul>li").width();                                               //动态获取的每个li的宽度
        var shBox = $(".search_result_part>div"), historyShBox = $(".history_part>div");//搜索结果和历史记录块
        $(this).addClass("colorWhite").parent().siblings().find("a").removeClass("colorWhite");
        Esf_touch.shType = $(".pa>ul>li>a.colorWhite").attr("data-shtype");
        //console.log(index)//每次点击都更新shtype
        switch (index) {
          case 1:
            redBg.animate({left: liW}, 100);
            redBg.removeClass('borderRadiusLeft').removeClass('borderRadiusRight');
            shBox.hide();
            shBox.eq(1).show();
            historyShBox.hide();
            historyShBox.eq(1).show();
            Esf_touch.postSH();
            break;
          case 2:
            redBg.animate({left: liW * 2}, 100);
            redBg.removeClass('borderRadiusLeft').removeClass('borderRadiusRight');
            shBox.hide();
            shBox.eq(2).show();
            historyShBox.hide();
            historyShBox.eq(2).show();
            Esf_touch.postSH();
            break;
          case 3:
            redBg.animate({left: liW * 3}, 100);
            redBg.removeClass('borderRadiusLeft').addClass('borderRadiusRight');
            shBox.hide();
            shBox.eq(3).show();
            historyShBox.hide();
            historyShBox.eq(3).show();
            Esf_touch.postSH();
            break;
          default :
            redBg.animate({left: 0}, 100);
            redBg.removeClass('borderRadiusRight').addClass('borderRadiusLeft');
            shBox.hide();
            shBox.eq(0).show();
            historyShBox.hide();
            historyShBox.eq(0).show();
            Esf_touch.postSH();
        }
      })
    }
  };
  window.Esf_touch = Esf_touch;
  Esf_touch.initSH();
  Esf_touch.changeTab();
  /**
   * 获取地理位置
   */
  var getLocation = {
    bdTemplate: '<li>' +
    '<a href="' + window.currenturl + '/info/<%=sina_id%>"><%=communityname%></a>' +
    '</li>',
    /**
     * 添加本地缓存的热门小区信息
     * @param  {[type]}   getObj     [本地缓存的热门小区信息]
     * */
    addLocationHome: function (getObj) {
      var localStr = window.localStorage.getItem('getObj');
      var getData = (typeof localStr == 'string') ? JSON.parse(localStr) : localStr;
      if (getData != undefined) {//如果能取到就解析
        var pushData = getData.split(",");
        var localHotHome = '';
        $.each(pushData, function (i, data) {
          var hotStr = '<li><a href="javascript:void(0);">' + pushData[i] + '</a></li>';
          localHotHome += hotStr;
        });
        $(".recommend_tab>h4").show().addClass("nearby").text('附近小区');
        $(".recommend_tab>ul").html(localHotHome);
      } else {//如果取不到，请求接口添加
        getLocation.readAddHome();
      }
    },
    /**
     * 读接口添加热门小区（跨域接口）
     * */
    readAddHome: function () {
      var url = 'http://' + window.curcityEn + '.esf.leju.com/di/hotkeyword/?citycode=' + window.curcityEn + '&callback=?';
      $.getJSON(url, function (res) {
        var res = (typeof res == 'string') ? JSON.parse(res) : res;
        if (res) {
          //var resData = res.data.slice(0, 6);
          var resData = res.data;
          var hotHtml = '';
          //console.log(resData);
          $.each(resData, function (i, v) {
            var hotStr = '<li><a href="javascript:void(0);">' + resData[i] + '</a></li>';
            hotHtml += hotStr;
          });
          /**************************************
           * iPhone6s的Safari浏览器会默认开启无痕模式，无痕模式下  localStorage.setItem    会报错！！
           **************************************/
          try {
            localStorage.setItem('hotHome', resData);
          } catch (e) {
            console.error(e.message);
            //alert(e.message);
          }
          $(".recommend_tab>h4").show().removeClass("nearby").text('热门搜索');
          $(".recommend_tab>ul").html(hotHtml);
        } else {//如果没有返回值，隐藏该板块；
          $('.recommend_tab').hide();
          console.log('取不到返回的小区信息');
        }
      });
    },
    /**
     * 浏览器支持原生获取地理位置经纬度时的回调
     * @param  {[type]}   pos     [获取到的结果，包含经纬度]
     * */
    successFn: function (pos) {
      if (pos) {
        //console.log(pos);
        var locationData = {
          x: pos.coords.longitude,//经度
          y: pos.coords.latitude//纬度
        };
        if (locationData.x != undefined && locationData.y != undefined) {//能获取到X，Y坐标时
          var url = 'http://' + window.curcityEn + '.esf.leju.com/di/positioncommunity/?citycode=' + window.curcityEn + '&x=' + locationData.x + '&y=' + locationData.y + '&callback=?';
          $.getJSON(url, function (res) {
            var res = (typeof res == 'string') ? JSON.parse(res) : res;
            if (res) {//能获取到后台的返回值
              if (res.data.list == '') {//如果返回来的data是空的，先取缓存的热门
                if (window.localStorage.getItem('hotHome') != null) {
                  var hotHomeData = window.localStorage.getItem('hotHome');
                  //console.log(hotHomeData);
                  getLocation.addLocationHome(hotHomeData);
                } else {//取不到缓存的结果
                  getLocation.readAddHome();
                }
              } else {//有返回值，并且不为空
                var sliceArr = res.data.list.slice(0, 6);
                var arr = [];
                $.each(sliceArr, function (i, v) {//循环添加模板
                  arr.push(baidu.template(getLocation.bdTemplate, v));
                });
                var locationTemplate = arr.join('');
                $(".recommend_tab>h4").show().addClass("nearby").text('附近小区');
                $(".recommend_tab>ul").html(locationTemplate);
              }
            } else {//获取不到后台的返回值
              if (window.localStorage.getItem('hotHome')) {
                getLocation.addLocationHome('hotHome');
              } else {
                getLocation.readAddHome();
              }
            }
          })
        }
        /*else { //只能获取其中一个值，或者都取不到
         if (window.localStorage.getItem('hotHome')) {
         getLocation.addLocationHome('hotHome');
         } else {
         getLocation.readAddHome();
         }
         }*/
      }
    },
    /**
     * 浏览器支持原生获取地理位置经纬度时的回调
     * @param  {[type]}   error     [获取不到地理位置或者没有开启定位]
     * */
    errorFn: function (error) {
      if (window.localStorage.getItem('hotHome')) {
        getLocation.addLocationHome('hotHome');
      } else {
        getLocation.readAddHome();
      }
    },
    //获取附近小区
    getNearByHome: function () {
      if (window.navigator.geolocation) {//浏览器是否支持获取经纬度H5自带;;
        window.navigator.geolocation.getCurrentPosition(getLocation.successFn, getLocation.errorFn, {timeout: 1000});
      } else {//若不支持获取，先取本地缓存的热门小区
        if (window.localStorage.getItem('hotHome')) {
          getLocation.addLocationHome('hotHome');
        } else {//如果没有缓存，重新请求
          getLocation.readAddHome();
        }
      }
    }
  };
  getLocation.getNearByHome();//获取定位小区,初始运行
  $(".i_closeBtn").on("click", function (e) {//输入框清除文字按钮
    e.stopPropagation();
    $(this).hide();
    $(".comm_search").val("");
    $('.search_result_part').hide();
  });
  $(".clean_result").on('click', function () {//清除历史记录
    $(this).hide();
    var noNewsreel = '<li><a href="javascript:void(0)">暂无搜索记录</a></li>';
    $(".history_part>div").find("ul").html(noNewsreel);
    window.localStorage.removeItem('historySH');
  });
  $('.recommend_tab>ul').on('click', 'a', function (e) { //热门小区，附近小区点击时根据传中切签跳转
    e.stopPropagation();
    var jumpUrl = '', val = $(this).text();
    switch (Esf_touch.shType) {
      case 'rent' :
        jumpUrl = window.currenturl + '/house/i2-o' + val;
        break;
      case 'home' :
        jumpUrl = window.currenturl + '/community/o' + val;
        break;
      case 'agent' :
        jumpUrl = window.currenturl + '/agent/o' + val;
        break;
      default :
        jumpUrl = window.currenturl + '/house/o' + val;
    }
    window.location.href = jumpUrl;
  });
  /**
   * 取url中的字符
   * */
  function getStr(str) {
    var fistStr = 'agent/';
    var fist = str.indexOf(fistStr) + fistStr.length;
    return str.substring(fist, str.length - 1);
  }
}