module.exports = {
    dynamic: {
        files: [{
            expand: true,
            cwd: 'app/assets/img',
            src: ['**/*.{png,jpg,gif}'],
            dest: 'app/assets/img'
        }]
    }
};
