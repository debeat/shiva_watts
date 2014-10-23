module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // CSS MINIFY
    cssmin: {
      my_target: {
        files: [{
          expand: true,
          src: ['*.css', '!*.min.css'],
          ext: '.min.css'
        }]
      }
    },

    // JS UGLIFY
    uglify: {
      my_target: {
        files: {
          'main.min.js': 'main.js' 
        }
      }
    }, 

    // SERVER CONNECT
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '*'
        }
      }
    },

    // WATCH

    watch: {
      uglify: {
        files: ['./main.js'],
        tasks: ['uglify'],
        options: {
          livereload: true
        }
      },
      cssmin: {
        files: ['style.css'],
        tasks: ['cssmin'],
        options: {
          livereload: true
        }
      },
    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['connect', 'watch']);

};
