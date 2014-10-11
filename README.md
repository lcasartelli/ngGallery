ngGallery
=========

Very simple gallery provider for Angular.js applications

## Usage
HTML
```html
<script type="text/javascript" src='../bower_components/angular/angular.min.js'></script>
<script type="text/javascript" src='../src/ngGallery.js'></script>
```
JavaScript
```javascript
var app = angular.module('exampleApp', ['ngGallery']);


app.controller('MainCtrl', function (ngGallery) {
  this.open = function () {
    ngGallery.open({ 
      images: ['./img/dw_1.jpg'],
      showClose: true,
      closeByEscape: true
    });
  };
});
```

## References

Heavily inspired by [ngDialog](https://github.com/likeastore/ngDialog).

## License

MIT Licensed
