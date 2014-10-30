module.exports = {
    dist: {
        options: {
            style: 'compresses',
            require: 'sass-globbing'
        },
        files: {
            'app/assets/css/main.css': 'app/assets/css/main.scss'
        }
    }
};
