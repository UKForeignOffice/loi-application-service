/**
 * Created by angelovas on 16/09/2015.
 */

module.exports = function(grunt) {
  const timestamp = new Date().getTime();
    grunt.config.set('sass', {
        dev: {
          options: {
            implementation: require('node-sass')
          },
          files: [{
                expand: true,
                cwd: 'assets/styles/',
                src: ['importer.scss'],
                dest: '.tmp/public/styles/',
                ext: `.${timestamp}.css`
            }]
        }
    });

    grunt.loadNpmTasks('grunt-sass');
};
