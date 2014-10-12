/* global angular */

'use strict';

var app = angular.module('TestApp', ['ngGallery']);

app.controller('MainController', function (ngGallery) {
  
  this.open = function () {
    ngGallery.open({ 
      template: '<p>Hello</p>',
      plain: true,
      images: [
        './img/dw_1.jpg',
        './img/dw_2.jpg',
        './img/dw_3.gif',
        './img/dw_4.jpg',
        './img/dw_5.jpg',
        './img/dw_6.gif',
        './img/dw_7.jpg',
        './img/dw_8.jpg',
        './img/dw_9.jpg',
        './img/dw_10.jpg',
        './img/dw_11.jpg',
        './img/dw_12.jpg'
      ],
      showClose: true,
      closeByEscape: true
    });
  };
});