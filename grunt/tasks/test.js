module.exports = function (grunt) {
    grunt.registerTask('test', [
        'jshint:all',
        'env:test',
        'concurrent:build',
        'mochaTest:test'
    ]);
};
