var module;

module = angular.module('ngGallery', []);

module.config([
  '$logProvider', function($logProvider) {
    return $logProvider.debugEnabled(true);
  }
]);

module.provider('ngGallery', function() {
  var $el;
  $el = angular.element;
  this.defaults = {
    images: [],
    prefix: '',
    prevClass: '',
    nextClass: '',
    prevLabel: '<',
    nextLabel: '>',
    closeLabel: 'x',
    closeClass: '',
    url: false,
    infiniteLoop: false,
    timing: 0,
    showClose: true,
    closeByDocument: true,
    closeByEscape: true,
    closeByNavigation: false,
    preCloseCallback: false
  };
  this.$get = [
    '$rootScope', '$document', '$http', '$log', '$q', 'ngGalleryGlobal', 'ngGalleryKey', 'ngGalleryNav', function($rootScope, $document, $http, $log, $q, global, keys, nav) {
      var $body, generateTemplate, inject, loadImages;
      $body = $document.find('body');
      this.images = [];
      loadImages = (function(_this) {
        return function(param, opts) {
          var errorFn, successFn;
          if (Array.isArray(param)) {
            _this.images = param;
            return generateTemplate(opts);
          } else {
            successFn = function(response) {
              if (response != null) {
                _this.images = response.data;
                return generateTemplate(opts);
              }
            };
            errorFn = function(reason) {
              return $log.error('Loading images error', reason);
            };
            return ($http.get(param)).then(successFn, errorFn);
          }
        };
      })(this);
      generateTemplate = (function(_this) {
        return function(opts) {
          var image, imageTemplate, template, _i, _len, _ref;
          template = '<div class="gallery"><button class="gallery-close-btn ' + opts.closeClass + '" data-ng-click="closeThisDialog()">' + opts.closeLabel + '</button>';
          imageTemplate = function(image, i) {
            return template += '<div class="gallery-item animate-show" data-ng-show="nav.visibleItemIndex === ' + i + '" data-ng-click="closeGallery($event)"><span class="helper"></span><span  data-ng-click="nav.next()"><img src="' + opts.prefix + image + '"/></span></div>';
          };
          _ref = _this.images;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            image = _ref[_i];
            imageTemplate(image);
          }
          return template += '<div class="gallery-prev-next-container"><button class="gallery-prev-btn ' + opts.prevClass + '" data-ng-click="nav.prev()">' + opts.prevLabel + '</button><button class="gallery-next-btn ' + opts.nextClass + '" data-ng-click="nav.next()">' + opts.nextLabel + '</button></div></div>';
        };
      })(this);
      inject = function(template) {
        var htmlNode;
        htmlNode = $el('<div id="nggallery' + global.globalID() + '" class="nggallery"></div>');
        if (htmlNode != null) {
          htmlNode.html('<div class="nggallery-overlay"></div><div class="nggallery-content">' + template + '</div>');
          return $body.append(htmlNode);
        } else {

        }
      };
      this.open = function(opts) {
        var options, _loadParam, _template;
        if (opts == null) {
          opts = {};
        }
        $log.info('Hello lemon! :)');
        options = angular.extend({}, this.defaults, opts);
        global.incGlobalID();
        if ((options.url != null) && url_regex.test(options.url)) {
          _loadParam = options.url;
        } else {
          _loadParam = options.images;
        }
        _template = '';
        if (options.showClose) {
          _template += '<div class="nggallery-close"></div>';
        }
        return ($q.when(loadImages(_loadParam, options))).then(function(tmpl) {
          _template += tmpl;
          inject(_template);
          nav.bind(options);
          keys.bind(options);
          return $rootScope.$emit('ngGallery-opened', {
            id: global.globalID()
          });
        });
      };
      return {
        open: this.open
      };
    }
  ];
});

module = angular.module('ngGallery');

module.service('ngGalleryGlobal', [
  function() {
    var globalID;
    globalID = 0;
    this.incGlobalID = function() {
      return globalID += 1;
    };
    this.globalID = function() {
      return globalID;
    };
  }
]);

module = angular.module('ngGallery');

module.service('ngGalleryKey', [
  '$document', 'ngGalleryNav', function($document, nav) {
    var onKeyDown;
    this.LEFT_ARROW_KEY = 37;
    this.RIGHT_ARROW_KEY = 39;
    this.ESC_KEY = 27;
    this.closeByEscape = false;
    onKeyDown = function(event) {
      if (event.keyCode === this.LEFT_ARROW_KEY) {
        return nav.prevImage();
      } else if (event.keyCode === this.RIGHT_ARROW_KEY) {
        return nav.nextImage();
      } else if (event.keyCode === this.ESC_KEY) {
        if (this.closeByEscape) {
          return nav.close('$escape');
        }
      }
    };
    this.bind = function(opts) {
      var body;
      this.closeByEscape = opts.closeByEscape;
      body = $document.find('body');
      if (body != null) {
        return body.bind('keydown', onKeyDown);
      }
    };
  }
]);

module = angular.module('ngGallery');

module.service('ngGalleryNav', [
  '$document', '$interval', function($document, $interval) {
    var addDelay, startAuto, stopAuto;
    this.visibleItemIndex = 0;
    this.itemsNum = 0;
    this.transitionDelay = 0;
    this.interval = null;
    this.timing = 0;
    this.infiniteLoop = false;
    this.closeByNavigation = false;
    addDelay = function(fn) {
      if (this.transitionDelay > 0) {
        return function() {
          return $timeout(fn, this.transitionDelay);
        };
      } else {
        return fn;
      }
    };
    this.next = (function(_this) {
      return function() {
        var _next;
        _next = function() {
          console.log(_this.visibleItemIndex);
          if (_this.visibleItemIndex === _this.itemsNum) {
            if (_this.infiniteLoop) {
              return _this.visibleItemIndex = 0;
            } else {
              if (_this.closeByNavigation) {
                return stopAuto();
              }
            }
          } else {
            return _this.visibleItemIndex += 1;
          }
        };
        return (addDelay(_next))();
      };
    })(this);
    this.prev = (function(_this) {
      return function() {
        var _prev;
        _prev = function() {
          if (_this.visibleItemIndex !== 0) {
            return _this.visibleItemIndex -= 1;
          } else {
            if (_this.infiniteLoop) {
              return _this.visibleItemIndex = _this.itemsNum;
            }
          }
        };
        return (addDelay(_prev))();
      };
    })(this);
    startAuto = (function(_this) {
      return function() {
        return _this.interval = $interval((function() {
          return _this.next();
        }), _this.timing);
      };
    })(this);
    stopAuto = (function(_this) {
      return function() {
        if (_this.interval != null) {
          return $interval.cancel(_this.interval);
        }
      };
    })(this);
    this.close = (function(_this) {
      return function(dialog) {
        return stopAuto();
      };
    })(this);
    this.bind = (function(_this) {
      return function(opts) {
        _this.transitionDelay = opts.transitionDelay;
        _this.timing = opts.timing;
        _this.infiniteLoop = opts.infiniteLoop;
        _this.itemsNum = opts.images.length - 1;
        _this.closeByNavigation = opts.closeByNavigation;
        console.log('num', _this.itemsNum);
        if (_this.timing > 0) {
          return startAuto();
        }
      };
    })(this);
  }
]);
