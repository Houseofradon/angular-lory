/*!
 * angular-lory
 * 
 * 
 * Version: 0.1.0 - 2015-11-10T08:52:05.764Z
 * License: 
 */


'use strict';

angular
  .module('ngLory', [])
  //global config
  .constant('ngLoryConfig', {
    method: {},
    event: {}
  })
  .directive('lory', ['$window', '$timeout', 'ngLoryConfig', function($window, $timeout, ngLoryConfig) {
    var loryMethodList = [
      'prev',
      'next',
      'slideTo',
      'returnIndex',
      'setup',
      'reset',
      'destroy'
    ];
    var loryEventList = [
      'before.lory.init',
      'after.lory.init',
      'before.lory.slide',
      'after.lory.slide',
      'on.lory.resize',
      'on.lory.touchstart',
      'on.lory.touchmove',
      'on.lory.touchend',
      'on.lory.destroy'
    ];

    return {
      scope: {
        settings: '=',
        slidesToScroll: '@',
        infinite: '@',
        rewind: '@',
        slideSpeed: '@',
        rewindSpeed: '@',
        snapBackSpeed: '@',
        ease: '@',
        classNameFrame: '@',
        classNameSlideContainer: '@',
        classNamePrevCtrl: '@',
        classNameNextCtrl: '@'
      },
      restrict: 'AE',
      link: function(scope, element, attrs) {

        angular.element(element).css('display', 'none');

        var lorySlider, options, initOptions, destroy, init, destroyAndInit, currentIndex;

        initOptions = function() {
          options = angular.extend(angular.copy(ngLoryConfig), {
            slidesToScroll: !isNaN(parseInt(scope.slidesToScroll, 10)) ? parseInt(scope.slidesToScroll, 10) : 1,
            infinite: !isNaN(parseInt(scope.infinite, 10)) ? parseInt(scope.infinitve, 10) : false,
            rewind: !isNaN(parseInt(scope.rewind, 10)) ? parseInt(scope.rewind, 10) : true,
            slideSpeed: !isNaN(parseInt(scope.slideSpeed, 10)) ? parseInt(scope.slideSpeed, 10) : 300,
            rewindSpeed: !isNaN(parseInt(scope.rewindSpeed, 10)) ? parseInt(scope.rewindSpeed, 10) : 600,
            snapBackSpeed: !isNaN(parseInt(scope.snapBackSpeed, 10)) ? parseInt(scope.snapBackSpeed, 10) : 200,
            ease: scope.cssEase || 'ease',
            classNameFrame: scope.ClassNameFrame || 'js_frame',
            classNameSlideContainer: scope.classNameSlideContainer || 'js_slides',
            classNamePrevCtrl: scope.classNamePrevCtrl || 'js_prev',
            classNameNextCtrl: scope.classNameNextCtrl || 'js_next'
          }, scope.settings);
        };

        destroy = function() {
          var loryElement = angular.element(element);
          if (lorySlider) {
            // remove Lory
           lorySlider.destroy();
          }
          return loryElement;
        };

        init = function() {
          initOptions();
          var loryElement = angular.element(element)[0];

          if (lorySlider) {
            lorySlider.reset();
          } else {

            angular.element(element).css('display', 'block');
            loryElement.addEventListener('after.lory.init', function(event, lory) {

              if (typeof currentIndex !== 'undefined') {
                //return lorySlider.slideTo(currentIndex);
              }

            });

            $timeout(function() {
              lorySlider = $window.lory(loryElement, options);
            }, 0);

          }

          scope.internalControl = options.method || {};

          // Method
          loryMethodList.forEach(function (value) {
            scope.internalControl[value] = function () {
              var args;
              args = Array.prototype.slice.call(arguments);
              args.unshift(value);
              lorySlider[value](args[args.length - 1]);
            };
          });

          // arguments: currentSlide, nextSlide
          // fires before slide change
          loryElement.addEventListener('before.lory.slide', function(event, currentSlide, nextSlide) {
            if (typeof options.event.beforeSlide === 'function') {
              options.event.beforeSlide(event);
            }
          });

          loryElement.addEventListener('after.lory.slide', function(event, currentSlide) {
            if (typeof options.event.afterSlide === 'function') {
              console.log(arguments);
              console.log('afterSlide');
            }
          });

          if (typeof options.event.reInit === 'function') {
            loryElement.addEventListener('after.loro.init', function(event) {
              console.log(arguments);
            })
          }

          if (typeof options.event.resize !== 'undefined') {
            loryElement.addEventListener('on.lory.resize', function(event) {
              console.log('resize');
            });
          }

          if (typeof options.event.destroy !== 'undefined') {
            loryElement.addEventListener('on.lory.destroy', function(event) {
              console.log('destroy');
              options.event.destroy(event, lorySlider, loryElement);
            });
          }

        }

        destroyAndInit = function () {
          destroy();
          init();
        };

        element.one('$destroy', function () {
          destroy();
        });

        return scope.$watch('settings', function (newVal, oldVal) {
          if (newVal !== null) {
            return destroyAndInit();
          }
        }, true);

      }
    };

  }]);