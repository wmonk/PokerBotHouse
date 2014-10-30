module.exports = function (grunt) {
    grunt.registerTask('dev', [
        'jshint:all',
        'env:dev',
        'concurrent:build',
        'concurrent:dev',
        'watch'
    ]);
};
