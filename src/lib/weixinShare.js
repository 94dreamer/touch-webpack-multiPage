

/**
 * author zz
 * function 微信分享
 * @param {[type]} [varname] [description]
 */
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
    /*wx.checkJsApi({
     jsApiList: [
     'onMenuShareTimeline'
     ],
     success: function(res) {
     alert(JSON.stringify(res));
     }
     });*/
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