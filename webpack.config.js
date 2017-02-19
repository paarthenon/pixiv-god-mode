const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        content: './vendor/chrome/content/chrome.ts',
        popup: './vendor/chrome/popup/bootstrap.tsx',
        background: './vendor/chrome/background/main.ts',
        options: './vendor/chrome/options/options.tsx'
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
    },
    //TODO: separate these plugins between dev and prod.
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            mangle: false,
            beautify: {
                ascii_only: true
            }
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
}
