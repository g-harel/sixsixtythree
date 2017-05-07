module.exports = {
    entry: './src/client/app.js',
    output: {
        path: __dirname + '/src/public',
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015'],
                    },
                },
            },
        ],
    },
};
