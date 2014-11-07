/* global angular */

'use strict';

var app = angular.module('TestApp', ['ngGallery']);

app.controller('MainController', function (ngGallery) {
  
  this.open = function () {
    ngGallery.open({ 
      template: '<p>Hello</p>',
      plain: true,
      url: './list.json',
      prefix: '../img/',
      showClose: true,
      closeByEscape: true
    });
  };
});