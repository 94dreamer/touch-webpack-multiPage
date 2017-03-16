

/**
 * author zz
 * function 微信分享
 * @param {[type]} [varname] [description]
 */
/*
var wxShare = function(obj) {
  var tappId = obj.tappId;
  var ttimestamp = obj.ttimestamp;
  var tnonceStr = obj.tnonceStr;
  var tsignature = obj.tsignature;

  var shareTitle = obj.shareTitle;
  var shareDesc = obj.shareDesc;
  var shareUrl = obj.shareUrl;
  var imgUrl = obj.imgUrl;
  var successFun = function(){};
  var errorFun = function(){};
  if(obj.successFun){
    var successFun = obj.successFun;
  }
  if(obj.errorFun){
    var errorFun = obj.errorFun;
  }

  wx.config({
    debug: false,
    appId: tappId,
    timestamp: ttimestamp,
    nonceStr: tnonceStr,
    signature: tsignature,
    jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems']
  });

  wx.ready(function() {
    /!*wx.checkJsApi({
     jsApiList: [
     'onMenuShareTimeline'
     ],
     success: function(res) {
     alert(JSON.stringify(res));
     }
     });*!/
    wx.onMenuShareTimeline({
      title: shareTitle, // 分享标题
      link: shareUrl, // 分享链接
      imgUrl: imgUrl, // 分享图标
      success: function() {
        successFun();
      },
      cancel: function() {
        errorFun();
        // popUpWindowWX({
        //     mesBody: "分享失败",
        //     iconStyle: "error-icon",
        //     paddingTop: "45%"
        // });
      }
    });

    //share to friend
    wx.onMenuShareAppMessage({
      title: shareTitle, // 分享标题
      desc: shareDesc, // 分享描述
      link: shareUrl, // 分享链接
      imgUrl: imgUrl, // 分享图标
      type: '', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function() {
        // alert("success");
        //$("#go_sharesuccess").trigger("click");
      },
      cancel: function() {
        // alert("error");
        // 用户取消分享后执行的回调函数
      }
    });

    //share to QQ
    wx.onMenuShareQQ({
      title: shareTitle, // 分享标题
      desc: shareDesc, // 分享描述
      link: shareUrl, // 分享链接
      imgUrl: imgUrl, // 分享图标
      success: function() {
        //$("#go_sharesuccess").trigger("click");
      },
      cancel: function() {
        // alert("error");
        // 用户取消分享后执行的回调函数
      }
    });

    //share to TecentWeiBo
    wx.onMenuShareWeibo({
      title: shareTitle, // 分享标题
      desc: shareDesc, // 分享描述
      link: shareUrl, // 分享链接
      imgUrl: imgUrl, // 分享图标
      success: function() {
        // $("#go_sharesuccess").trigger("click");
      },
      cancel: function() {
        // alert("error");
        // 用户取消分享后执行的回调函数
      }
    });

    //share to Qzone
    wx.onMenuShareQZone({
      title: shareTitle, // 分享标题
      desc: shareDesc, // 分享描述
      link: shareUrl, // 分享链接
      imgUrl: imgUrl, // 分享图标
      success: function() {
        //$("#go_sharesuccess").trigger("click");
      },
      cancel: function() {
        // alert("error");
        // 用户取消分享后执行的回调函数
      }
    });

    wx.hideMenuItems({
      menuList: ['openWithQQBrowser', 'openWithSafari'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
    });

    // wx.error(function(res) {
    //     alert('wx.error: ' + JSON.stringify(res));
    // });

  });
}
*/

/**
 * 对外提供的微信分享js
 * @author mingxing
 */
var weixinApi=window.weixinApi || {};
weixinApi.share=(function(){
  var wxShareData={};
  //动态加载js
  function loadJsFile(filename,callback){
    var fileref = document.createElement('script');
    fileref.setAttribute("type","text/javascript");
    fileref.setAttribute("src",filename);
    if(typeof fileref != "undefined"){
      fileref.onload = function(){
        callback && callback();
      }
      document.getElementsByTagName("head")[0].appendChild(fileref);
    }
  }
  //加载jssdk必要参数
  function loadShareConfig(){
    var apiUrl='http://m.leju.com/index.php?site=api&ctl=initjssdk&act=index&callback=jsonpCallback&url='+encodeURIComponent(location.href);
    if(wxShareData.weixin_house_id)
    {
      apiUrl+="&weixin_house_id="+wxShareData.weixin_house_id;
    }
    loadJsFile(apiUrl);
  }
  //初始化微信对象
  function initWx(wx,result)
  {
    wx.config({
      debug: wxShareData.debug?wxShareData.debug:false,
      appId: result.appid,
      timestamp: result.timestamp,
      nonceStr: result.noncestr,
      signature: result.signature,
      jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
    });
    wx.ready(function () {
      wx.onMenuShareTimeline({
        title: wxShareData.title,
        link: wxShareData.link,
        imgUrl: wxShareData.imgUrl,
        success: wxShareData.success?wxShareData.success:function(){},
        cancel: wxShareData.cancel?wxShareData.cancel:function(){}
      });
      wx.onMenuShareAppMessage({
        title: wxShareData.title,
        desc: wxShareData.desc,
        link: wxShareData.link,
        imgUrl: wxShareData.imgUrl,
        success: wxShareData.success?wxShareData.success:function(){},
        cancel: wxShareData.cancel?wxShareData.cancel:function(){}
      });

    });
  }
  //jsonp回调函数
  if(!window.jsonpCallback)
  {
    window.jsonpCallback = function(result){
      if(window.wx)
      {
        initWx(window.wx,result);
      }
      else
      {
        loadJsFile("http://res.wx.qq.com/open/js/jweixin-1.0.0.js",function(){
          if (typeof define === 'function' && define.cmd)
          {
            // CMD 规范，for：seajs
            seajs.use("http://res.wx.qq.com/open/js/jweixin-1.0.0.js", function(wx) {
              initWx(wx,result);
            });
          }
          else
          {
            initWx(wx,result)
          }
        });
      }
    }
  }
  //初始操作
  function init(data)
  {
    wxShareData=data;
    loadShareConfig();
  }
  return {
    init:init
  }
})();
weixinApi.share.init({
  title:$("title").text(),
  desc:"乐居·二手房最大最真实的北京二手房网，为您提供优质北京二手房信息，查找最新北京二手房房源信息，免费发布个人房源出售出租信息，就到乐居二手房网！".replace(/北京/g,curcityCn),
  link:window.location.href,
  imgUrl:'http://res2.esf.leju.com/m_leju/images/share_leju.png?v=v20170316_01'
});
