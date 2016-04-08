module.exports = {
    entry: './devserver/main.js',
    output: {
        path: './devserver/',
        filename: 'index.js'
    },
    module: {
        loaders: [
            {
                loader: 'babel',
                query: {
                    presets: ['es2015']
                },
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    }
};
