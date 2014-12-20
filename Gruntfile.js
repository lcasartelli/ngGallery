/* jshint node:true */


module.exports = function(grunt) {
  'use strict';
  

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      js: ['dist/*.js'],
      css: ['dist/*.css']
    },
    coffee: {
      dev: {
        options: { bare: true, join: true },
        files: { 'dist/ngGallery.js': ['src/ngGallery.coffee', 'src/services/*.coffee'] }
      }
    },
    less: {
      dev: {
        files: { "dist/ngGallery.css": "src/css/*" }
      }
    },
    watch: {
      js: {
        files: ['src/ngGallery.coffee', 'src/services/*.coffee'],
        tasks: ['clean:js', 'coffee'],
        options: {
          livereload: true
        }
      },
      css: {
        files: ['src/ngGallery.less'],
        task: ['clean:css', 'less:dev'],
        options: {
          livereload: true
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 3300
        }
      }
    }
  });


  grunt.registerTask('default', [ 'clean', 'less:dev', 'coffee:dev', 'connect', 'watch']);
};
