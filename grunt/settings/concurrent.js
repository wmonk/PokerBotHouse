module.exports = {
    options: {
        logConcurrentOutput: true
    },
    build: [
        'sass',
        'autoprefixer',
        'browserify',
        'imagemin'
    ],
    dev: [
        'watch',
        'supervisor'
    ]
};
