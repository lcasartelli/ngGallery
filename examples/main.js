/* global angular */

'use strict';

var app = angular.module('TestApp', ['ngGallery']);

app.controller('MainController', function (ngGallery) {
  
  this.open = function () {
    ngGallery.open({ 
      template: '<p>Hello</p>',
      plain: true,
      images: ['./img/dw_1.jpg'],
      showClose: true,
      closeByEscape: true
    });
  };
});