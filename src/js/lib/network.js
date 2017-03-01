/**
 * Created by zhouzhen on 2017/2/28.
 */
/**
 * 检测是wifi还是普通网络
 * */
//<img id="pic" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
// data-src="images/100x100.png" data-src2="images/200x200.png" data-src3="images/300x300.png"
// alt="" width="100" height="100">

(function(win){
  var wifi = true;
  var ua = win.navigator.userAgent;
  var con = win.navigator.connection;
  // 如果是微信
  if(/MicroMessenger/.test(ua)){
    // 如果是微信6.0以上版本，用UA来判断
    if(/NetType/.test(ua)){
      var result = ua.match(/NetType\/(\S)+/)[0].replace('NetType/','');
      if(result && result != 'WIFI'){
        wifi = false;
      }
      // 如果是微信6.0以下版本，调用微信私有接口WeixinJSBridge
    }else{
      document.addEventListener("WeixinJSBridgeReady",function onBridgeReady(){
        WeixinJSBridge.invoke('getNetworkType',{},function(e){
          if(e.err_msg != "network_type:wifi"){
            wifi = false;
          }
        });
      });
    }
    // 如果支持navigator.connection
  }else if(con){
    var network = con.type;
    if(network != "wifi" && network != "2" && network != "unknown"){  // unknown是为了兼容Chrome Canary
      wifi = false;
    }
  }
  win.networkWIFI = wifi;
})(window);


window.onload = function(){
  var $img = document.querySelector("#pic");
  var dpr = window.devicePixelRatio || 1;
  // 替换图片
  if(networkWIFI){
    if(dpr >= 3){
      $img.setAttribute('srcset', $img.getAttribute('data-src2')+" 2x,"+$img.getAttribute('data-src3')+" 3x");
      $img.setAttribute('src', $img.getAttribute('data-src2'));
    }else{
      $img.setAttribute('src',$img.getAttribute('data-src2'));
    }
  }else{
    if(dpr >= 3){
      $img.setAttribute('src',$img.getAttribute('data-src2'));
    }else{
      $img.setAttribute('src',$img.getAttribute('data-src'));
    }
  }
};

