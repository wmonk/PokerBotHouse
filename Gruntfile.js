/*
 * Introduction
 * -----------
 *
 * This file sets up all our grunt task it is kinda awesome
 */

/*
 * Required node_modules
 * --------------------
 *
 * Extend
 */
var _ = require('lodash');

/*
 * Grunt Loader
 */
function loadConfig(path) {

    var glob = require('glob');
    var object = {};
    var key;

    glob.sync('**/*.js', {
        cwd: path
    }).forEach(function (option) {
        key = option.replace(/.*\/(\w+)/g, '$1').replace(/\.js$/, '');

        if (!object[key]) {
            object[key] = require(path + option);
        } else {
            object[key] = _.extend(object[key], require(path + option));
        }
    });

    return object;
}

module.exports = function (grunt) {
    'use strict';

    /*
     * This times our tasks so we can spot and optimize any bottlenecks
     */
    require('time-grunt')(grunt);

    /*
     * Load all the things but only as they are needed
     */
    require('jit-grunt')(grunt, {
        jscs: 'grunt-jscs-checker'
    });

    /*
     * Settings
     * -----------
     *
     * These are variables that can be used through out this file, they enable us to quickly change our directory structure
     */

    var config = {
        pkg: grunt.file.readJSON('./package.json')
    };

    config = _.extend(config, loadConfig('./grunt/settings/'));

    grunt.initConfig(config);
    grunt.loadTasks('./grunt/tasks');
};
