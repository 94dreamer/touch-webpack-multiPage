/**
 * Created by zhouzhen on 2017/3/3.
 * 检查目标元素是否已曝光，是否处于浏览器可视区域内
 *
 * Usage
 * import isExposure from 'isExposure';
 * isExposure( document.getElementById('test') ) // => true or false
 */
var docElement = window.document.documentElement;

function getViewportH() {
  var inner = window.innerHeight;
  var client = docElement.clientHeight;
  return client < inner ? inner : client;
}

function getScrollY() {
  return window.pageYOffset || docElement.scrollTop;
}

// http://stackoverflow.com/a/5598797/989439
function getOffset( el ) {
  var offsetTop = 0, offsetLeft = 0;
  do {
    if ( !isNaN( el.offsetTop ) ) {
      offsetTop += el.offsetTop;
    }
    if ( !isNaN( el.offsetLeft ) ) {
      offsetLeft += el.offsetLeft;
    }
  } while( el = el.offsetParent )

  return {
    top : offsetTop,
    left : offsetLeft
  }
}

function isExposure( el, h ) {
  var elH = el.offsetHeight,
    scrolled = getScrollY(),
    viewed = scrolled + getViewportH(),
    elTop = getOffset(el).top,
    elBottom = elTop + elH,
    // if 0, the element is considered in the viewport as soon as it enters.
    // if 1, the element is considered in the viewport only when it's fully inside
    // value in percentage (1 >= h >= 0)
    h = h || 0;

  return (elTop + elH * h) <= viewed && (elBottom - elH * h) >= scrolled;
}

export default isExposure;