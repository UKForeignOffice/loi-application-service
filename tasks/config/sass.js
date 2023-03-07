/**
 * Created by angelovas on 16/09/2015.
 */

module.exports = function(grunt) {

    grunt.config.set('sass', {
        dev: {
          options: {
            implementation: require('sass'),
            quiet: true // Add the quiet flag to suppress warnings
          },
          files: [{
                expand: true,
                cwd: 'assets/styles/',
                src: ['importer.scss'],
                dest: '.tmp/public/styles/',
                ext: '.css'
            }]
        }
    });

    grunt.loadNpmTasks('grunt-sass');
};
