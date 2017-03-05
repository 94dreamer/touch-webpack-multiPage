/**!
 * zhouzhen 修改 2017/3/3。
 *
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2015 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.7
 *
 */

(function($, window, document, undefined) {
  var $window = $(window);

  $.fn.lazyload = function(options) {
    var elements = this;
    var $container;
    var settings = {
      threshold       : 0,
      failure_limit   : 0,
      event           : "scroll",
      effect          : "show",
      container       : window,
      // data_attribute  : "original",
      data_attribute  : "src",
      skip_invisible  : false,
      appear          : null,
      load            : null,
      //placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
      placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAqgAAAH0CAMAAADGwi9/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhGQTA2NjkyQzNEMTExRTZBMjQ0OTgxN0E1QzA0NzM0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhGQTA2NjkzQzNEMTExRTZBMjQ0OTgxN0E1QzA0NzM0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OEZBMDY2OTBDM0QxMTFFNkEyNDQ5ODE3QTVDMDQ3MzQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OEZBMDY2OTFDM0QxMTFFNkEyNDQ5ODE3QTVDMDQ3MzQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz49gXs0AAAADFBMVEXh6fD3+vzr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"
    };

    function update() {
      var counter = 0;

      elements.each(function() {
        var $this = $(this);
        if (settings.skip_invisible && !$this.is(":visible")) {//该ele是不可见的
          return;
        }
        if ($.abovethetop(this, settings) || $.leftofbegin(this, settings)) {
          /* Nothing. */
        } else if (!$.belowthefold(this, settings) && !$.rightoffold(this, settings)) {
          $this.trigger("appear");
          /* if we found an image we'll load, reset the counter */
          counter = 0;
        } else {
          if (++counter > settings.failure_limit) {
            return false;
          }
        }
      });

    }

    if(options) {
      /* Maintain BC for a couple of versions. 兼容版本 */
      if (undefined !== options.failurelimit) {
        options.failure_limit = options.failurelimit;
        delete options.failurelimit;
      }
      if (undefined !== options.effectspeed) {
        options.effect_speed = options.effectspeed;
        delete options.effectspeed;
      }

      $.extend(settings, options);
    }

    /* Cache container as jQuery as object. 缓存jq的容器对象*/
    $container = (settings.container === undefined ||
    settings.container === window) ? $window : $(settings.container);

    /* Fire one scroll event per scroll. Not one scroll event per image. */
    if (0 === settings.event.indexOf("scroll")) {
      $container.on(settings.event, function() {
        return update();
      });
    }

    this.each(function() {
      var self = this;
      var $self = $(self);

      self.loaded = false;

      /* If no src attribute given use data:uri. */
      if ($self.attr("src") === undefined || $self.attr("src") === false) {
        if ($self.is("img")) {
          $self.attr("src", settings.placeholder);
        }
      }

      /* When appear is triggered load original image. */
      $self.one("appear", function() {
        if (!this.loaded) {
          if (settings.appear) {
            var elements_left = elements.length;
            settings.appear.call(self, elements_left, settings);
          }
          $("<img />")
            .one("load", function() {
              var original = $self.attr("data-" + settings.data_attribute);
              $self.hide();
              if ($self.is("img")) {
                $self.attr("src", original);
              } else {
                $self.css("background-image", "url('" + original + "')");
              }
              $self[settings.effect](settings.effect_speed);

              self.loaded = true;

              /* Remove image from array so it is not looped next time. */
              var temp = $.grep(elements, function(element) {
                return !element.loaded;
              });
              elements = $(temp);

              if (settings.load) {
                var elements_left = elements.length;
                settings.load.call(self, elements_left, settings);
              }
            })
            .attr("src", $self.attr("data-" + settings.data_attribute));
        }
      });

      /* When wanted event is triggered load original image */
      /* by triggering appear.                              */
      if (0 !== settings.event.indexOf("scroll")) {
        $self.on(settings.event, function() {
          if (!self.loaded) {
            $self.trigger("appear");
          }
        });
      }
    });

    /* Check if something appears when window is resized. */
    $window.on("resize", function() {
      update();
    });

    /* With IOS5 force loading images when navigating with back button. */
    /* Non optimal workaround. */
    if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
      $window.on("pageshow", function(event) {
        if (event.originalEvent && event.originalEvent.persisted) {
          elements.each(function() {
            $(this).trigger("appear");
          });
        }
      });
    }

    /* Force initial check if images should appear. */
    $(document).ready(function() {
      update();
    });

    return this;
  };

  /* Convenience methods in jQuery namespace.           */
  /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

  $.belowthefold = function(element, settings) {
    var fold;

    if (settings.container === undefined || settings.container === window) {
      fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
    } else {
      fold = $(settings.container).offset().top + $(settings.container).height();
    }

    return fold <= $(element).offset().top - settings.threshold;
  };

  $.rightoffold = function(element, settings) {
    var fold;

    if (settings.container === undefined || settings.container === window) {
      fold = $window.width() + $window.scrollLeft();
    } else {
      fold = $(settings.container).offset().left + $(settings.container).width();
    }

    return fold <= $(element).offset().left - settings.threshold;
  };

  $.abovethetop = function(element, settings) {
    var fold;

    if (settings.container === undefined || settings.container === window) {
      fold = $window.scrollTop();
    } else {
      fold = $(settings.container).offset().top;
    }

    return fold >= $(element).offset().top + settings.threshold  + $(element).height();
  };

  $.leftofbegin = function(element, settings) {
    var fold;

    if (settings.container === undefined || settings.container === window) {
      fold = $window.scrollLeft();
    } else {
      fold = $(settings.container).offset().left;
    }

    return fold >= $(element).offset().left + settings.threshold + $(element).width();
  };

  $.inviewport = function(element, settings) {
    return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
      !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
  };

  /* Custom selectors for your convenience.   */
  /* Use as $("img:below-the-fold").something() or */
  /* $("img").filter(":below-the-fold").something() which is faster */

  $.extend($.expr[":"], {
    "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
    "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
    "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
    "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
    "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
    /* Maintain BC for couple of versions. */
    "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
    "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
    "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
  });

})(jQuery, window, document);