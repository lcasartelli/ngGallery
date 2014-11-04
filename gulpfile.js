/* jshint node: true */

'use strict';


var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    mincss = require('gulp-minify-css'),
    ngAnnotate = require('gulp-ng-annotate');


gulp.task('js', function () {
  gulp.src('src/*.js')
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(concat('ngGallery.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function() {
  gulp.src('./src/*.css')
    .pipe(mincss())
    .pipe(concat('ngGallery.min.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  gulp.watch('src/*.js', ['js']);
  gulp.watch('src/*.css', ['css']);
});


gulp.task('default', ['js', 'css', 'watch']);