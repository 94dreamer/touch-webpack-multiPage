/**
 * Created by zhouzhen on 2017/3/3.
 */

;(function (win, lib, ctrl) {
  var doc = win.document;
  var ua = win.navigator.userAgent;
  var Firefox = !!ua.match(/Firefox/i);
  var IEMobile = !!ua.match(/IEMobile/i);
  var cssPrefix = Firefox ? '-moz-' : IEMobile ? '-ms-' : '-webkit-';
  var stylePrefix = Firefox ? 'Moz' : IEMobile ? 'ms' : 'webkit';


  function setHTMLElement(parent, child) {//设置html内容
    if (typeof child === 'string') {
      parent.innerHTML = child;
    } else if (child instanceof HTMLElement) {
      parent.innerHTML = '';
      parent.appendChild(child);
    } else if (child instanceof Array || child instanceof NodeList) {
      var fragment = doc.createDocumentFragment();
      Array.prototype.slice.call(child).forEach(function (node) {
        fragment.appendChild(node);
      });
      parent.appendChild(fragment);
    }
  }

  function getTransformOffset(element) {//获取
    var offset = {x: 0, y: 0};
    var transform = getComputedStyle(element)[stylePrefix + 'Transform'];
    var matched;

    if (transform !== 'none') {
      if ((matched = transform.match(/^matrix3d\((?:[-\d.]+,\s*){12}([-\d.]+),\s*([-\d.]+)(?:,\s*[-\d.]+){2}\)/) ||
          transform.match(/^matrix\((?:[-\d.]+,\s*){4}([-\d.]+),\s*([-\d.]+)\)$/))) {
        offset.x = parseFloat(matched[1]) || 0;
        offset.y = parseFloat(matched[2]) || 0;
      }
    }

    return offset;
  }

  var CSSMatrix = IEMobile ? 'MSCSSMatrix' : 'WebKitCSSMatrix';
  var has3d = !!Firefox || CSSMatrix in win && 'm11' in new win[CSSMatrix]();

  function getTranslate(x, y) {
    x = parseFloat(x);
    y = parseFloat(y);

    if (x != 0) {
      x += 'px';
    }

    if (y != 0) {
      y += 'px';
    }

    if (has3d) {
      return 'translate3d(' + x + ', ' + y + ', 0)';
    } else {
      return 'translate(' + x + ', ' + y + ')';
    }
  }

  function setTransitionStyle(element, duration, timingFunction) {
    if (arguments.length === 1) {
      element.style[stylePrefix + 'Transition'] = '';
    } else {
      element.style[stylePrefix + 'Transition'] = cssPrefix + 'transform ' + duration + ' ' + timingFunction + ' 0s';
    }
  }

  function setTransformStyle(element, x, y) {
    element.style[stylePrefix + 'Transform'] = getTranslate(x, y);
  }

  var incId = 0;

  function ScrollView(root, options) {

    function fireEvent(name, extra) {
      var ev = doc.createEvent('HTMLEvents');
      ev.initEvent(name, false, false);
      if (extra) {
        for (var key in extra) {
          ev[key] = extra[key];
        }
      }
      scroll.element.dispatchEvent(ev);
    }

    var that = this;
    var id = Date.now() + '-' + (++incId);

    if (arguments.length === 1 && !(arguments[0] instanceof HTMLElement)) {
      options = arguments[0];
      root = null;
    }

    options = options || {};
    if (!root) {
      root = doc.createElement('div');
    }
    var scrollWrap = root.firstElementChild || doc.createElement('div');
    var scrollElement = scrollWrap.firstElementChild || doc.createElement('div');

    if (!scrollWrap.parentNode) {
      root.appendChild(scrollWrap);
    }

    if (!scrollElement.parentNode) {
      scrollWrap.appendChild(scrollElement);
    }

    root.setAttribute('data-ctrl-name', 'scrollview');
    root.setAttribute('data-ctrl-id', id);
    root.setAttribute('data-direction', options.direction !== 'x' ? 'vertical' : 'horizontal');
    if (scrollWrap.className.indexOf('scroll-wrap') < 0) {
      scrollWrap.className = scrollWrap.className.split(' ').concat('scroll-wrap').join(' ').replace(/^\s+/, '');
    }
    if (scrollElement.className.indexOf('scroll-content') < 0) {
      scrollElement.className = scrollElement.className.split(' ').concat('scroll-content').join(' ').replace(/^\s+/, '');
    }

    options.scrollElement = scrollElement;
    options.scrollWrap = scrollWrap;

    var scroll = new lib.scroll(options);

    this.scrollWrap = scrollWrap;
    this.scrollElement = scrollElement;
    this.scroll = scroll;
    this.root = this.element = root;

    for (var name in scroll) {
      void function (name) {
        if (typeof scroll[name] === 'function') {
          that[name] = function () {
            return scroll[name].apply(scroll, arguments);
          }
        } else {
          Object.defineProperty(that, name, {
            get: function () {
              return scroll[name];
            },
            set: function (v) {
              scroll[name] = v;
            }
          })
        }
      }(name);
    }

    Object.defineProperty(this, 'forceRepaint', {
      value: new ForceRepaint(this)
    });

    Object.defineProperty(this, 'fixed', {
      value: new Fixed(this)
    });

    Object.defineProperty(this, 'lazyload', {
      value: new Lazyload(this)
    });

    Object.defineProperty(this, 'sticky', {
      value: new Sticky(this)
    });

    Object.defineProperty(this, 'pullRefresh', {
      value: new Refresh(this)
    });

    // refersh init
    (function () {
      if (scroll.axis !== 'y') return;

      var height = win.dpr ? win.dpr * 60 : 60;
      var processingText = '下拉即可刷新...';
      var refreshText = '正在刷新...';

      var refreshLoading = new ctrl.loading();
      refreshLoading.arrowDirection = 'down';
      refreshLoading.mode = 'draw';
      refreshLoading.text = processingText;
      var element = refreshLoading.element;

      that.pullRefresh.element = element;
      that.pullRefresh.height = height;
      that.pullRefresh.processingHandler = function (offset) {
        if (refreshLoading.mode !== 'draw') {
          refreshLoading.mode = 'draw';
        }
        if (refreshLoading.text !== processingText) {
          refreshLoading.text = processingText;
        }
        refreshLoading.per = Math.round(offset / height * 100);
      }
      that.pullRefresh.refreshHandler = function (done) {
        var isDone = false;
        refreshLoading.text = refreshText;
        refreshLoading.mode = 'spin';
        that.pullRefresh.handler && that.pullRefresh.handler(function () {
          if (isDone) return;
          isDone = true;
          done();
        });
      }
    })();

    Object.defineProperty(this, 'pullUpdate', {
      value: new Update(this)
    });

    // update init
    (function () {
      if (scroll.axis !== 'y') return;

      var height = win.dpr ? win.dpr * 60 : 60;
      var processingText = '上拉加载更多...';
      var updateText = '正在加载...';

      var updateLoading = new ctrl.loading();
      updateLoading.arrowDirection = 'up';
      updateLoading.mode = 'draw';
      updateLoading.text = processingText;
      var element = updateLoading.element;

      that.pullUpdate.element = element;
      that.pullUpdate.height = height;

      that.pullUpdate.processingHandler = function (offset) {
        if (updateLoading.mode !== 'draw') {
          updateLoading.mode = 'draw';
        }
        if (updateLoading.text !== processingText) {
          updateLoading.text = processingText;
        }
        updateLoading.per = Math.round(offset / height * 100);
      }

      that.pullUpdate.updateHandler = function (done) {
        var isDone = false;
        updateLoading.text = updateText;
        updateLoading.mode = 'spin';
        that.pullUpdate.handler && that.pullUpdate.handler(function () {
          if (isDone) return;
          isDone = true;
          done();
        });
      }
    })();

    Object.defineProperty(this, 'content', {
      get: function () {
        return Array.prototype.slice.call(element.childNodes);
      },
      set: function (content) {
        setHTMLElement(scrollElement, content);
      }
    });
  }

  function ForceRepaint(view) {
    var scroll = view.scroll;
    var forceRepaintElement = doc.createElement('div');
    forceRepaintElement.className = 'force-repaint';
    forceRepaintElement.style.cssText = 'position: absolute; top: 0; left: 0; width: 0; height: 0; font-size: 0; opacity: 1;';
    view.root.appendChild(forceRepaintElement);

    var enable = false;
    Object.defineProperty(this, 'enable', {
      get: function () {
        return enable;
      },
      set: function (v) {
        enable = v;
      }
    }, false);

    Object.defineProperty(this, 'element', {
      value: forceRepaintElement
    });

    scroll.addScrollingHandler(function () {
      if (!enable) return;
      forceRepaintElement.style.opacity = Math.abs(parseInt(forceRepaintElement.style.opacity) - 1) + '';
    });
  }

  function Fixed(view) {
    var that = this;
    var scroll = view.scroll;
    var fragment = doc.createDocumentFragment();
    var topFixedElement;
    var bottomFixedElement;
    var leftFixedElement;
    var rightFixedElement;

    var enable = false;
    Object.defineProperty(that, 'enable', {
      get: function () {
        return enable;
      },
      set: function (v) {
        enable = v;
        if (!!enable) {
          if (topFixedElement) {
            if (!topFixedElement.parentNode) {
              view.root.insertBefore(topFixedElement, view.scrollWrap);
            }
            topFixedElement.style.display = 'block';
          }
          if (bottomFixedElement) {
            if (!bottomFixedElement.parentNode) {
              view.root.appendChild(bottomFixedElement);
            }
            bottomFixedElement.style.display = 'block';
          }
          if (leftFixedElement) {
            if (!leftFixedElement.parentNode) {
              view.root.insertBefore(leftFixedElement, view.scrollWrap);
            }
            leftFixedElement.style.display = 'block';
          }
          if (rightFixedElement) {
            if (!rightFixedElement.parentNode) {
              view.root.appendChild(rightFixedElement);
            }
            rightFixedElement.style.display = 'block';
          }
        } else {
          topFiexElement && (topFixedElement.style.display = 'none');
          bottomFixedElement && (bottomFixedElement.style.display = 'none');
          leftFixedElement && (leftFixedElement.style.display = 'none');
          rightFixedElement && (rightFixedElement.style.display = 'none');
        }
      }
    });

    if (scroll.axis === 'y') {
      topFixedElement = doc.createElement('div');
      topFixedElement.className = 'top-fixed';
      topFixedElement.style.cssText = 'left: 0; top: 0; width: 100%;';
      Object.defineProperty(that, 'topElement', {
        get: function () {
          return topFixedElement;
        },
        set: function (v) {
          setHTMLElement(topFixedElement, v);
        }
      });
      Object.defineProperty(that, 'topOffset', {
        set: function (v) {
          topFixedElement.style.top = v + 'px';
        }
      });

      bottomFixedElement = this.bottomFixedElement = doc.createElement('div');
      bottomFixedElement.className = 'bottom-fxied';
      bottomFixedElement.style.cssText = 'left: 0; bottom: 0; width: 100%;';
      Object.defineProperty(that, 'bottomElement', {
        get: function () {
          return bottomFixedElement;
        },
        set: function (v) {
          setHTMLElement(bottomFixedElement, v);
        }
      });
      Object.defineProperty(that, 'bottomOffset', {
        set: function (v) {
          bottomFixedElement.style.top = v + 'px';
        }
      });
    } else {
      leftFixedElement = this.leftFixedElement = doc.createElement('div');
      leftFixedElement.className = 'left-fixed';
      leftFixedElement.style.cssText = 'top: 0; left: 0; height: 100%;';
      Object.defineProperty(that, 'leftElement', {
        get: function () {
          return leftFixedElement;
        },
        set: function (v) {
          setHTMLElement(leftFixedElement, v);
        }
      });
      Object.defineProperty(that, 'leftOffset', {
        set: function (v) {
          leftFixedElement.style.left = v + 'px';
        }
      });

      rightFixedElement = this.rightFixedElement = doc.createElement('div');
      rightFixedElement.className = 'right-fxied';
      rightFixedElement.style.cssText = 'top: 0; right: 0; height: 100%;';
      Object.defineProperty(that, 'rightElement', {
        get: function () {
          return rightFixedElement;
        },
        set: function (v) {
          setHTMLElement(rightFixedElement, v);
        }
      });
      Object.defineProperty(that, 'rightOffset', {
        set: function (v) {
          rightFixedElement.style.right = v + 'px';
        }
      });
    }
  }

  function Lazyload(view) {
    var that = this;
    var scroll = view.scroll;
    var limit = 4;
    var waitingQueue = [];
    var loadingCount = 0;
    var loaded = {};

    var isRunningLoadingQueue = false;

    function runLoadingQueue() {
      if (isRunningLoadingQueue) return;
      isRunningLoadingQueue = true;

      if (loadingCount < limit && waitingQueue.length > 0) {
        var url = waitingQueue.shift();
        loadingCount++;

        var img = new Image();
        img.onload = img.onreadystatechange = function () {
          if (loaded[url] !== true) {
            loaded[url].forEach(function (cb) {
              cb && cb(url);
            });
            loaded[url] = true;
            loadingCount--;
          }
          runLoadingQueue();
        }
        img.src = url;
        runLoadingQueue();
      }

      isRunningLoadingQueue = false;
    }

    function load(url, callback) {
      if (loaded[url] === true) {
        return callback(url);
      } else if (loaded[url]) {
        loaded[url].push(callback);
      } else {
        loaded[url] = [callback];
        waitingQueue.push(url);
      }
      runLoadingQueue();
    }

    function checkLazyload() {
      if (!enable) return;

      var elements = Array.prototype.slice.call(scroll.element.querySelectorAll('.lazy, *[lazyload="true"]'));

      elements.filter(function (el) {
        return scroll.isInView(el);
      }).forEach(function (el) {
        var imglist;
        var bglist;

        if (el.tagName.toUpperCase() === 'IMG') {
          imglist = [el];
          bglist = [];
        } else {
          imglist = Array.prototype.slice.call(el.querySelectorAll('img[data-src]'));
          bglist = Array.prototype.slice.call(el.querySelectorAll('*[data-image]'));
          if (el.hasAttribute('data-image')) {
            bglist.push(el);
          }
        }

        imglist.forEach(function (img) {
          var src = img.getAttribute('data-src');
          if (src) {
            img.removeAttribute('data-src');
            load(src, function () {
              img.src = src;
            });
          }
        });

        bglist.forEach(function (bg) {
          var image = bg.getAttribute('data-image');
          if (image) {
            bg.removeAttribute('data-image');
            load(image, function () {
              bg.style.backgroundImage = 'url(' + image + ')';
            });
          }
        });

        lazyloadHandler && lazyloadHandler(el);
        el.className = el.className.split(' ').filter(function (name) {
          return name !== 'lazy'
        }).join(' ');
        el.removeAttribute('lazyload');
      });
    }

    var enable;
    Object.defineProperty(that, 'enable', {
      get: function () {
        return enable;
      },
      set: function (v) {
        enable = v;
      }
    });


    var lazyloadHandler;
    Object.defineProperty(that, 'handler', {
      get: function () {
        return lazyloadHandler;
      },
      set: function (v) {
        lazyloadHandler = v;
      }
    });

    var realtime;
    Object.defineProperty(that, 'realtime', {
      get: function () {
        return realtime;
      },
      set: function (v) {
        realtime = !!v;
        if (realtime) {
          view.forceRepaint.enable = true;
        }
      }
    });

    scroll.addScrollingHandler(function () {
      if (realtime) {
        checkLazyload();
      }
    });

    scroll.addScrollendHandler(function () {
      checkLazyload();
    });

    scroll.addContentrenfreshHandler(function () {
      checkLazyload();
    });

    lib.animation.requestFrame(function () {
      checkLazyload();
    });

    view.checkLazyload = checkLazyload;
  }

  function Sticky(view) { //上边距时,添加 .am-sticky 类,将元素的 position 设置为 fixed,同时设置一个 top 值(默认为 0)
    var that = this;
    var scroll = view.scroll;

    var stickyWrapElement = doc.createElement('div');
    stickyWrapElement.className = 'sticky';
    stickyWrapElement.style.cssText = 'z-index:9; position: absolute; left: 0; top: 0;' + cssPrefix + 'transform: translateZ(9px);';
    if (scroll.axis === 'y') {
      stickyWrapElement.style.width = '100%';
    } else {
      stickyWrapElement.style.height = '100%';
    }

    Object.defineProperty(this, 'offset', {
      set: function (v) {
        if (scroll.axis === 'y') {
          stickyWrapElement.style.top = v + 'px';
        } else {
          stickyWrapElement.style.left = v + 'px';
        }
      }
    });

    var enable;
    Object.defineProperty(this, 'enable', {
      get: function () {
        return enable;
      },
      set: function (v) {
        enable = !!v;
        if (enable) {
          if (!stickyWrapElement.parentNode) {
            scroll.viewport.appendChild(stickyWrapElement);
          }
          stickyWrapElement.style.display = 'block';
        } else {
          stickyWrapElement.style.display = 'none';
        }
      }
    });

    var stickyList = [];

    function checkSticky() {
      if (!enable) return;

      Array.prototype.slice.call(scroll.element.querySelectorAll('.sticky, *[sticky="true"]')).forEach(function (el) {
        el.className = el.className.split(' ').filter(function (name) {
          return name !== 'sticky'
        }).join(' ');
        el.setAttribute('sticky', 'initialized');
        var offset = scroll.offset(el);
        var top = offset.top;
        for (var i = 0; i <= stickyList.length; i++) {
          if (!stickyList[i] || top < stickyList[i].top) {
            stickyList.splice(i, 0, {
              top: top,
              el: el,
              pined: el.firstElementChild
            });
            break;
          }
        }
      });

      if (stickyList.length) {
        var scrollOffset = scroll.axis === 'y' ? scroll.getScrollTop() : scroll.getScrollLeft();
        for (var i = 0; i < stickyList.length; i++) {
          if (scrollOffset < stickyList[i][scroll.axis === 'y' ? 'top' : 'left']) {
            break;
          }
        }

        j = i - 1;
        if (j > -1) {
          if (!stickyList[j].pined.parentNode || stickyList[j].pined.parentNode === stickyList[j].el) {
            stickyWrapElement.innerHTML = '';
            stickyWrapElement.appendChild(stickyList[j].pined);
          }
        }

        for (j++; j < stickyList.length; j++) {
          if (stickyList[j].pined.parentNode !== stickyList[j].el) {
            stickyList[j].el.appendChild(stickyList[j].pined);
          }
        }
      }
    }

    view.forceRepaint.enable = true;
    scroll.addScrollingHandler(checkSticky);
    scroll.addScrollendHandler(checkSticky);

    view.checkSticky = checkSticky;
  }//上边距时,添加 .am-sticky 类,将元素的 position 设置为 fixed,同时设置一个 top 值(默认为 0)

  function Refresh(view) {
    var that = this;
    var scroll = view.scroll;

    var refreshElement = doc.createElement('div');
    refreshElement.className = 'refresh';
    refreshElement.style.cssText = 'display: none; position: absolute; top: 0; left: 0; width: 0; height: 0; ' + cssPrefix + 'transform: translateZ(9px)';
    if (scroll.axis === 'y') {
      refreshElement.style.width = '100%';
    } else {
      refreshElement.style.height = '100%';
    }

    var enable = false;
    Object.defineProperty(this, 'enable', {
      get: function () {
        return enable;
      },
      set: function (v) {
        enable = v;
        if (!!enable) {
          if (!refreshElement.parentNode) {
            scroll.viewport.appendChild(refreshElement);
          }
          refreshElement.style.display = 'block';
        } else {
          refreshElement.style.display = 'none';
        }
      }
    });

    Object.defineProperty(this, 'element', {
      get: function () {
        return refreshElement;
      },
      set: function (v) {
        setHTMLElement(refreshElement, v);
      }
    });

    Object.defineProperty(this, 'offset', {
      set: function (v) {
        if (scroll.axis === 'y') {
          refreshElement.style.top = v + 'px';
        } else {
          refreshElement.style.left = v + 'px';
        }
      }
    });

    var width = 0;
    Object.defineProperty(this, 'width', {
      set: function (v) {
        width = v;
        if (scroll.axis === 'x') {
          refreshElement.style.width = width + 'px';
          refreshElement.style[stylePrefix + 'Transform'] = 'translateX(' + (-width) + 'px) translateZ(9px)';
        }
      }
    });

    var height = 0;
    Object.defineProperty(this, 'height', {
      set: function (v) {
        height = v;
        if (scroll.axis === 'y') {
          refreshElement.style.height = height + 'px';
          refreshElement.style[stylePrefix + 'Transform'] = 'translateY(' + (-height) + 'px) translateZ(9px)';
        }
      }
    });

    var processingHandler;
    Object.defineProperty(this, 'processingHandler', {
      get: function () {
        return processingHandler;
      },
      set: function (v) {
        processingHandler = v;
      }
    });

    var refreshHandler;
    Object.defineProperty(this, 'refreshHandler', {
      get: function () {
        return refreshHandler;
      },
      set: function (v) {
        refreshHandler = v;
      }
    });

    var isRefresh;

    scroll.addScrollingHandler(function (e) {
      if (!enable || isRefresh) return;

      var offset = scroll.axis === 'y' ? scroll.getScrollTop() : scroll.getScrollLeft();
      offset = Math.min(offset, 0);

      if (scroll.axis === 'y') {
        refreshElement.style[stylePrefix + 'Transform'] = 'translateY(' + -(height + offset) + 'px) translateZ(9px)';
      } else {
        refreshElement.style[stylePrefix + 'Transform'] = 'translateX(' + -(width + offset) + 'px) translateZ(9px)';
      }

      if (offset < 0) {
        processingHandler && processingHandler(-offset);
      }
    });


    function pullingAnimation(callback) {
      var refreshOffset = getTransformOffset(refreshElement)[scroll.axis];
      var refreshDiff = 0 - refreshOffset;
      var elementOffset = getTransformOffset(scroll.element)[scroll.axis];
      var elementDiff = (scroll.axis === 'y' ? height : width) - elementOffset;

      var anim = new lib.animation(400, lib.cubicbezier.ease, 0, function (i1, i2) {
        refreshElement.style[stylePrefix + 'Transform'] = 'translate' + scroll.axis.toUpperCase() + '(' + (refreshOffset + refreshDiff * i2) + 'px) translateZ(9px)';
        scroll.element.style[stylePrefix + 'Transform'] = 'translate' + scroll.axis.toUpperCase() + '(' + (elementOffset + elementDiff * i2) + 'px)';
      });

      anim.onend(callback);

      anim.play();
    }

    function reboundAnimation(callback) {
      var refreshOffset = getTransformOffset(refreshElement)[scroll.axis];
      var refreshDiff = -(scroll.axis === 'y' ? height : width) - refreshOffset;
      var elementOffset = getTransformOffset(scroll.element)[scroll.axis];
      var elementDiff = -elementOffset;

      var anim = new lib.animation(400, lib.cubicbezier.ease, 0, function (i1, i2) {
        refreshElement.style[stylePrefix + 'Transform'] = 'translate' + scroll.axis.toUpperCase() + '(' + (refreshOffset + refreshDiff * i2) + 'px) translateZ(9px)';
        scroll.element.style[stylePrefix + 'Transform'] = 'translate' + scroll.axis.toUpperCase() + '(' + (elementOffset + elementDiff * i2) + 'px)';
      });

      anim.onend(callback);

      anim.play();
    }

    scroll.addEventListener('pulldownend', function (e) {
      if (!enable || isRefresh) return;
      isRefresh = true;

      var offset = scroll.getBoundaryOffset();
      if (offset > (scroll.axis === 'y' ? height : width)) {
        scroll.disable();
        pullingAnimation(function () {
          if (refreshHandler) {
            refreshHandler(function () {
              reboundAnimation(function () {
                scroll.refresh();
                scroll.enable();
                isRefresh = false;
              });
            });
          } else {
            reboundAnimation(function () {
              scroll.refresh();
              scroll.enable();
              isRefresh = false;
            });
          }
        });
      } else {
        reboundAnimation(function () {
          isRefresh = false;
        });
      }
    }, false);
  }

  function Update(view) {
    var that = this;
    var scroll = view.scroll;

    var updateElement = doc.createElement('div');
    updateElement.className = 'update';
    updateElement.style.cssText = 'display: none; position: absolute; bottom: 0; right: 0; width: 0; height: 0; ' + cssPrefix + 'transform: translateZ(9px)';
    if (scroll.axis === 'y') {
      updateElement.style.width = '100%';
    } else {
      updateElement.style.height = '100%';
    }

    var enable = false;
    Object.defineProperty(this, 'enable', {
      get: function () {
        return enable;
      },
      set: function (v) {
        enable = v;
        if (!!enable) {
          if (!updateElement.parentNode) {
            scroll.viewport.appendChild(updateElement);
          }
          updateElement.style.display = 'block';
        } else {
          updateElement.style.display = 'none';
        }
      }
    });

    Object.defineProperty(this, 'element', {
      get: function () {
        return updateElement;
      },
      set: function (v) {
        setHTMLElement(updateElement, v);
      }
    });

    Object.defineProperty(this, 'offset', {
      set: function (v) {
        if (scroll.axis === 'y') {
          updateElement.style.bottom = v + 'px';
        } else {
          updateElement.style.right = v + 'px';
        }
      }
    });

    var width = 0;
    Object.defineProperty(this, 'width', {
      set: function (v) {
        width = v;
        if (scroll.axis === 'x') {
          updateElement.style.width = width + 'px';
          updateElement.style[stylePrefix + 'Transform'] = 'translateX(' + (width) + 'px) translateZ(9px)';
        }
      }
    });

    var height = 0;
    Object.defineProperty(this, 'height', {
      set: function (v) {
        height = v;
        if (scroll.axis === 'y') {
          updateElement.style.height = height + 'px';
          updateElement.style[stylePrefix + 'Transform'] = 'translateY(' + (height) + 'px) translateZ(9px)';
        }
      }
    });

    var processingHandler;
    Object.defineProperty(this, 'processingHandler', {
      get: function () {
        return processingHandler;
      },
      set: function (v) {
        processingHandler = v;
      }
    });

    var updateHandler;
    Object.defineProperty(this, 'updateHandler', {
      get: function () {
        return updateHandler;
      },
      set: function (v) {
        updateHandler = v;
      }
    });

    var isUpdating;
    scroll.addScrollingHandler(function (e) {
      if (!enable) return;

      var offset = scroll.axis === 'y' ? scroll.getScrollTop() : scroll.getScrollLeft();
      var maxOffset = scroll.axis === 'y' ? scroll.getMaxScrollTop() : scroll.getMaxScrollLeft();
      offset = Math.max(offset, maxOffset);

      if (scroll.axis === 'y') {
        updateElement.style[stylePrefix + 'Transform'] = 'translateY(' + (maxOffset - offset + height) + 'px) translateZ(9px)';
      } else {
        updateElement.style[stylePrefix + 'Transform'] = 'translateX(' + (maxOffset - offset + width) + 'px) translateZ(9px)';
      }

      if (isUpdating) return;

      if (offset - maxOffset < (scroll.axis === 'y' ? height : width) * 0.7) {
        processingHandler && processingHandler(offset - maxOffset);
      } else {
        if (updateHandler) {
          isUpdating = true;
          updateHandler(function () {
            if (scroll.axis === 'y') {
              updateElement.style[stylePrefix + 'Transform'] = 'translateY(' + (height) + 'px) translateZ(9px)';
            } else {
              updateElement.style[stylePrefix + 'Transform'] = 'translateX(' + (width) + 'px) translateZ(9px)';
            }
            scroll.refresh();
            isUpdating = false;
          });
        }
      }
    });
  }

  ctrl.scrollview = ScrollView;
})(window, window['lib'], window['ctrl'] || (window['ctrl'] = {}));//