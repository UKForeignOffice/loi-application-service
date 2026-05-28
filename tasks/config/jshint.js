module.exports = (grunt) => {
  grunt.config.set('jshint', {
    all: ['api/**/*.js'],
    //'test/**/*.js', 'data/**/*.js']
  })

  grunt.loadNpmTasks('grunt-contrib-jshint')
}
