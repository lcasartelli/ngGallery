
(function (window, angular, undefined) {
  'use strict';

  var module = angular.module('ngGallery', ['ngAnimate']);

  var $el = angular.element;
  var isDef = angular.isDefined;
  var style = (document.body || document.documentElement).style;
  var animationEndSupport = isDef(style.animation) || isDef(style.WebkitAnimation) || isDef(style.MozAnimation) || isDef(style.MsAnimation) || isDef(style.OAnimation);
  var animationEndEvent = 'animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend';

  module.provider('ngGallery', function () {
    var defaults = this.defaults = {
      showClose: true,
      prefix: '',
      prevClass: '',
      nextClass: '',
      prevLabel: '<',
      nextLabel: '>',
      closeLabel: 'x',
      closeClass: '',
      closeByDocument: true,
      closeByEscape: true,
      closeByNavigation: false,
      appendTo: false,
      preCloseCallback: false,
      url: false,
      infiniteLoop: false,
      timing: false
    };


    this.setDefaults = function (newDefaults) {
      angular.extend(defaults, newDefaults);
    };

    var globalID = 0, dialogsCount = 0, closeByDocumentHandler, defers = {};

    this.$get = ['$document', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller', '$interval',
      function ($document, $compile, $q, $http, $rootScope, $timeout, $window, $controller, $interval) {
        var $body = $document.find('body');

        var privateMethods = {
          onDocumentKeydown: function (event) {
            if (event.keyCode === 27) {
              publicMethods.close('$escape');
            }
          },

          onGalleryKeydown: function (scope) {
            return function () {
              var dialogScope = scope;
              if (event.keyCode === 37) {
                dialogScope.prevImage();
              }
              else if (event.keyCode === 39) {
                dialogScope.nextImage();
              }
            };
          },

          setBodyPadding: function (width) {
            var originalBodyPadding = parseInt(($body.css('padding-right') || 0), 10);
            $body.css('padding-right', (originalBodyPadding + width) + 'px');
            $body.data('ng-dialog-original-padding', originalBodyPadding);
          },

          resetBodyPadding: function () {
            var originalBodyPadding = $body.data('ng-dialog-original-padding');
            if (originalBodyPadding) {
              $body.css('padding-right', originalBodyPadding + 'px');
            } else {
              $body.css('padding-right', '');
            }
          },

          performCloseDialog: function ($dialog, value) {
            var id = $dialog.attr('id');

            if (typeof window.Hammer !== 'undefined') {
              window.Hammer($dialog[0]).off('tap', closeByDocumentHandler);
            } else {
              $dialog.unbind('click');
            }

            if (dialogsCount === 1) {
              $body.unbind('keydown');
            }

            if (!$dialog.hasClass('nggallery-closing')) {
              dialogsCount -= 1;
            }

            if (animationEndSupport) {
              $dialog.unbind(animationEndEvent).bind(animationEndEvent, function () {
                $dialog.scope().$destroy();
                $dialog.remove();
                if (dialogsCount === 0) {
                  $body.removeClass('nggallery-open');
                  privateMethods.resetBodyPadding();
                }
                $rootScope.$broadcast('ngGallery.closed', $dialog);
              }).addClass('nggallery-closing');
            } else {
              $dialog.scope().$destroy();
              $dialog.remove();
              if (dialogsCount === 0) {
                $body.removeClass('nggallery-open');
                privateMethods.resetBodyPadding();
              }
              $rootScope.$broadcast('ngGallery.closed', $dialog);
            }
            if (defers[id]) {
              defers[id].resolve({
                id: id,
                value: value,
                $dialog: $dialog,
                remainingGallerys: dialogsCount
              });
              delete defers[id];
            }
          },

          closeDialog: function ($dialog, value) {
            var preCloseCallback = $dialog.data('$ngGalleryPreCloseCallback');

            if (preCloseCallback && angular.isFunction(preCloseCallback)) {

              var preCloseCallbackResult = preCloseCallback.call($dialog, value);

              if (angular.isObject(preCloseCallbackResult)) {
                if (preCloseCallbackResult.closePromise) {
                  preCloseCallbackResult.closePromise.then(function () {
                    privateMethods.performCloseDialog($dialog, value);
                  });
                } else {
                  preCloseCallbackResult.then(function () {
                    privateMethods.performCloseDialog($dialog, value);
                  }, function () {
                    return;
                  });
                }
              } else if (preCloseCallbackResult !== false) {
                privateMethods.performCloseDialog($dialog, value);
              }
            } else {
              privateMethods.performCloseDialog($dialog, value);
            }
          }
        };

        var publicMethods = {

          /*
           * @param {Object} options:
           * - template {String} - id of ng-template, url for partial, plain string (if enabled)
           * - scope {Object}
           * - controller {String}
           * - className {String} - dialog theme class
           * - showClose {Boolean} - show close button, default true
           * - closeByEscape {Boolean} - default true
           * - closeByDocument {Boolean} - default true
           * - preCloseCallback {String|Function} - user supplied function name/function called before closing dialog (if set)
           *
           * @return {Object} dialog
           */
          open: function (opts) {
            var self = this;
            var options = angular.copy(defaults);

            opts = opts || {};
            angular.extend(options, opts);

            globalID += 1;

            self.latestID = 'nggallery' + globalID;

            var defer;
            defers[self.latestID] = defer = $q.defer();

            var scope = angular.isObject(options.scope) ? options.scope.$new() : $rootScope.$new();
            var $dialog, $dialogParent;

            $q.when(loadImages(options.url, options.images)).then(function (template) {
              if (options.showClose) {
                template += '<div class="nggallery-close"></div>';
              }

              self.$result = $dialog = $el('<div id="nggallery' + globalID + '" class="nggallery"></div>');
              $dialog.html('<div class="nggallery-overlay"></div><div class="nggallery-content">' + template + '</div>');

              

              if (options.controller && (angular.isString(options.controller) || angular.isArray(options.controller) || angular.isFunction(options.controller))) {
                var controllerInstance = $controller(options.controller, {
                  $scope: scope,
                  $element: $dialog
                });
                $dialog.data('$ngGalleryControllerController', controllerInstance);
              }

              if (options.appendTo && angular.isString(options.appendTo)) {
                $dialogParent = angular.element(document.querySelector(options.appendTo));
              } else {
                $dialogParent = $body;
              }

              scope.visibleID = 0;

              scope.nextImage = function (byInterval) {
                  $timeout(function() {
                    if (byInterval !== true && scope.interval !== undefined) {
                      scope.clearInterval(scope.interval);
                      scope.setChangeInterval();
                    }
                    if (scope.visibleID === scope.images.length - 1 ) {
                      if (options.infiniteLoop) {
                        scope.visibleID = 0;
                      } else {
                        if (options.closeByNavigation) {
                          scope.closeThisDialog();
                        }
                      }
                    } else {
                      scope.visibleID += 1;
                    }
                  }, 0);
              };

              scope.prevImage = function () {
                 $timeout(function() {
                  if (scope.visibleID !== 0) {
                    scope.visibleID -= 1;
                  } else {
                    if(options.infiniteLoop) {
                      scope.visibleID = scope.images.length - 1;
                    }
                  }
                 }, 0);
              };

              scope.setChangeInterval = function() {
                scope.interval = $interval(function() {
                  scope.nextImage(true);
                }, options.timing);
              };

              scope.clearInterval = function(interval) {
                // TO DO add check if interval really is a promise
                $interval.cancel(interval);
              };

              scope.closeGallery = function (event) {
                if ($el(event.target).hasClass('gallery-item')) {
                  scope.closeThisDialog();
                }
              };

              scope.closeThisDialog = function (value) {
                privateMethods.closeDialog($dialog, value);
                if(scope.interval !== undefined) {
                  scope.clearInterval(scope.interval);
                }
              };

              $timeout(function () {
                $compile($dialog)(scope);

                var widthDiffs = $window.innerWidth - $body.prop('clientWidth');
                $body.addClass('nggallery-open');
                var scrollBarWidth = widthDiffs - ($window.innerWidth - $body.prop('clientWidth'));
                if (scrollBarWidth > 0) {
                  privateMethods.setBodyPadding(scrollBarWidth);
                }
                $dialogParent.append($dialog);

                if (options.name) {
                  $rootScope.$broadcast('ngGallery.opened', {dialog: $dialog, name: options.name});
                } else {
                  $rootScope.$broadcast('ngGallery.opened', $dialog);
                }
              });

              if (options.timing && options.timing > 0) {
                scope.setChangeInterval();  
              }

              if (options.closeByEscape) {
                $body.bind('keydown', privateMethods.onDocumentKeydown);
              }
              $body.bind('keydown', privateMethods.onGalleryKeydown(scope));

              closeByDocumentHandler = function (event) {
                var isOverlay = options.closeByDocument ? $el(event.target).hasClass('nggallery-overlay') : false;
                var isCloseBtn = $el(event.target).hasClass('nggallery-close');

                if (isOverlay || isCloseBtn) {
                  publicMethods.close($dialog.attr('id'), isCloseBtn ? '$closeButton' : '$document');
                }
              };

              if (typeof window.Hammer !== 'undefined') {
                window.Hammer($dialog[0]).on('tap', closeByDocumentHandler);
              } else {
                $dialog.bind('click', closeByDocumentHandler);
              }

              dialogsCount += 1;

              return publicMethods;
            }).catch(function(error) {
              console.log('error', error);
            });

            return {
              id: 'nggallery' + globalID,
              closePromise: defer.promise,
              close: function (value) {
                privateMethods.closeDialog($dialog, value);
              }
            };

            function generateTemplate(images) {
              scope.images = images;
              var template = '<div class="gallery"><button class="gallery-close-btn ' + options.closeClass + '" data-ng-click="closeThisDialog()">' + options.closeLabel + '</button>';
              for (var i = 0; i < images.length; ++i) {
                template += '<div class="gallery-item animate-show" data-ng-show="visibleID === ' + i + '" data-ng-click="closeGallery($event)"><span class="helper"></span><span  data-ng-click="nextImage()"><img src="' + options.prefix + images[i] + '"/></span></div>';
              }
              template += '<div class="gallery-prev-next-container"><button class="gallery-prev-btn ' + options.prevClass + '" data-ng-click="prevImage()">' + options.prevLabel + '</button><button class="gallery-next-btn ' + options.nextClass + '" data-ng-click="nextImage()">' + options.nextLabel + '</button></div></div>';
              return template;
            }


            function loadImages(url, images) {
          
              if(url !== false) {
                return $http.get(url).then(function(result) {
                  return generateTemplate(result.data);
                }, function(err) {
                  console.error(err);
                  throw 'Oh no! Something failed!';
                });
              } else {
                return generateTemplate(images);
              }
            }
          },

          /*
           * @param {Object} options:
           * - template {String} - id of ng-template, url for partial, plain string (if enabled)
           * - plain {Boolean} - enable plain string templates, default false
           * - scope {Object}
           * - controller {String}
           * - className {String} - dialog theme class
           * - showClose {Boolean} - show close button, default true
           * - closeByEscape {Boolean} - default false
           * - closeByDocument {Boolean} - default false
           * - preCloseCallback {String|Function} - user supplied function name/function called before closing dialog (if set); not called on confirm
           *
           * @return {Object} dialog
           */
          openConfirm: function (opts) {
            var defer = $q.defer();

            var options = {
              closeByEscape: false,
              closeByDocument: false
            };
            angular.extend(options, opts);

            options.scope = angular.isObject(options.scope) ? options.scope.$new() : $rootScope.$new();
            options.scope.confirm = function (value) {
              defer.resolve(value);
              var $dialog = $el(document.getElementById(openResult.id));
              privateMethods.performCloseDialog($dialog, value);
            };

            var openResult = publicMethods.open(options);
            openResult.closePromise.then(function (data) {
              if (data) {
                return defer.reject(data.value);
              }
              return defer.reject();
            });

            return defer.promise;
          },

          /*
           * @param {String} id
           * @return {Object} dialog
           */
          close: function (id, value) {
            var $dialog = $el(document.getElementById(id));

            if ($dialog.length) {
              privateMethods.closeDialog($dialog, value);
            } else {
              publicMethods.closeAll(value);
            }

            return publicMethods;
          },

          closeAll: function (value) {
            var $all = document.querySelectorAll('.nggallery');

            angular.forEach($all, function (dialog) {
              privateMethods.closeDialog($el(dialog), value);
            });
          },

          getDefaults: function () {
            return defaults;
          }
        };

        return publicMethods;
      }];
  });

  module.directive('ngGallery', ['ngGallery', function (ngGallery) {
    return {
      restrict: 'A',
      scope : {
        ngGalleryScope : '='
      },
      link: function (scope, elem, attrs) {
        elem.on('click', function (e) {
          e.preventDefault();

          var ngGalleryScope = angular.isDefined(scope.ngGalleryScope) ? scope.ngGalleryScope : 'noScope';

          var defaults = ngGallery.getDefaults();

          ngGallery.open({
            controller: attrs.ngGalleryController,
            scope: ngGalleryScope,
            data: attrs.ngGalleryData,
            prevClass: attrs.ngGalleryPrevClass,
            nextClass: attrs.ngGalleryNextClass,
            prevLabel: attrs.ngGalleryPrevLabel,
            nextLabel: attrs.ngGalleryNextLabel,
            closeLabel: attrs.ngGalleryCloseLabel,
            closeClass: attrs.ngGalleryCloseClass,
            prefix: attrs.ngGalleryPrefix,
            showClose: !attrs.ngGalleryShowClose ? false : (attrs.ngGalleryShowClose ? true : defaults.showClose),
            closeByDocument: !attrs.ngGalleryCloseByDocument ? false : (attrs.ngGalleryCloseByDocument ? true : defaults.closeByDocument),
            closeByEscape: !attrs.ngGalleryCloseByEscape ? false : (attrs.ngGalleryCloseByEscape ? true : defaults.closeByEscape),
            preCloseCallback: attrs.ngGalleryPreCloseCallback || defaults.preCloseCallback
          });
        });
      }
    };
  }]);

})(window, window.angular);
