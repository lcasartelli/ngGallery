/* global angular */

'use strict';

var app = angular.module('TestApp', ['ngGallery']);

app.controller('MainController', function (ngGallery) {
  
  this.open = function () {
    ngGallery.open({ 
      template: '<p>Hello</p>',
      plain: true,
      images: [
        'dw_1.jpg',
        'dw_2.jpg',
        'dw_3.gif',
        'dw_4.jpg',
        'dw_5.jpg',
        'dw_6.gif',
        'dw_7.jpg',
        'dw_8.jpg',
        'dw_9.jpg',
        'dw_10.jpg',
        'dw_11.jpg',
        'dw_12.jpg'
      ],
      prefix: './img/',
      showClose: true,
      closeByEscape: true,
      closeLabel: 'close',
      nextLabel: 'next',
      prevLabel: 'prev',
      circular: true
    });
  };
});