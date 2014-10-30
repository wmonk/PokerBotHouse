module.exports = {
    js: {
        files: ['app/assets/js/**/*.js', '!app/assets/js/**/*.compiled.js'],
        tasks: ['newer:jshint', 'browserify'],
        options: {
            interrupt: true
        }
    },

    img: {
        files: ['app/assets/img/**/*'],
        tasks: ['newer:imagemin'],
        options: {
            interrupt: true
        }
    },

    sass: {
        files: ['app/assets/css/**/*.scss', '!app/assets/css/**/*.compiled.css'],
        tasks: ['newer:sass', 'newer:autoprefixer'],
        options: {
            interrupt: true
        }
    },

    tests: {
        files: ['tests/**/*'],
        tasks: ['mochaTest'],
        options: {
            interrupt: true
        }
    }
};
