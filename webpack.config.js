const path = require('path');

module.exports = {
    entry: {
        content: './vendor/chrome/content/chrome.ts'
    },
    output: {
        path: path.resolve(__dirname, 'build/webpack'),
        filename: '[name].min.js'
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            presets: ['es2015']
                        }
                    },
                    'ts-loader'
                ]
            }
        ]
    },
    resolve: {
        modules: [
            __dirname,
            'node_modules'
        ],
        extensions: ['.ts','.tsx','.js']
    }
}
