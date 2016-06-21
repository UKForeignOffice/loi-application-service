module.exports = function(grunt) {

    grunt.config.set(
        'jsdoc' , {
            dist : {
                src: ['api/controllers/*.js', 'api/models/*.js', 'api/services/*.js', 'api/policies/*.js', 'api/userServiceModels/*.js', 'tests/specs/**/*.js', 'tests/ui/**/*.js', 'tests/files/*.js'],
                //src: ['api/controllers/ApplicationController.js'],
                options: {
                    destination: 'doc'
                }
            }
        }
    );

    grunt.loadNpmTasks('grunt-jsdoc');
};