module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          // target.css file: source.less file
          "assets/css/app.css": "assets/css/app.less"
        }
      }
    },
    uglify: {
      my_target: {
        files: {
          'dist/app.min.js': ['src/*.js'] 
        }  
      } 
    },
    watch: {
      styles: {
        files: ['assets/css/*.less'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      },
      scripts: {
        files: ['src/*.js'],
        tasks: ['uglify']
      }

    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);
};
