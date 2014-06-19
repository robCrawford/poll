module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    meta: {
      version: '0.1.0'
    },
    banner: '/*! poll.js - v<%= meta.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
      'Rob Crawford; Licensed MIT */\n',
    // Task configuration.
    jasmine: {
      src: 'src/*.js',
      options: {
        specs: 'test/specs/*Spec.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: 'src/poll.js',
        dest: 'dist/poll.min.js'
      }
    }
  });

  // Plugins.
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('default', ['jasmine', 'uglify']);

};