
module.exports = function(grunt) {
  'use strict';
  

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');


  grunt.initConfig({
    coffee: {
      compileJoined: {
        options: { bare: true, join: true },
        files: { 'dist/ngGallery.js': ['src/ngGallery.coffee', 'src/services/*.coffee'] }
      }
    },
    watch: {
      coffee: {
        files: ['src/ngGallery.coffee', 'src/services/*.coffee'],
        tasks: [ 'coffee']
      }
    }
  });


  grunt.registerTask('default', ['coffee', 'watch']);
};