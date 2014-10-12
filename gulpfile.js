/* jshint node: true */

'use strict';


var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');


gulp.task('scripts', function () {
  gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(concat('ngGallery.min.js'))
    .pipe(gulp.dest('dist'));
});


gulp.task('watch', function () {
  gulp.watch('src/*.js', ['scripts']);
});


gulp.task('default', ['scripts', 'watch']);