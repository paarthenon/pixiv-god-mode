import path from 'path';
import webpack from 'webpack';
import {TsconfigPathsPlugin} from 'tsconfig-paths-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const config: webpack.Configuration = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: {
        background: './src/background',
        content: './src/content',
        popup: './src/popup/index',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            presets: [
                                ["@babel/preset-env", { "targets": "last 2 versions, ie 11", "modules": false }]
                            ],
                        }
                    },
                    {
                        loader: 'ts-loader',
                    }
                ]

            },
            {
                test: /\.css$/,
                use: [
                  "style-loader",
                  {
                    loader: "css-loader",
                    options: {
                      modules: true, // default is false
                      sourceMap: true,
                      importLoaders: 1,
                    },
                  },
                ]
              },
              {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts',
                            publicPath: 'dist/fonts',
                        }
                    }
                ],
              },
              {
                test: /\.(png|jpg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images',
                            publicPath: 'images',
                        }
                    }
                ],
              },
              {
                  test: /\.scss$/,
                  use: [
                      "style-loader",
                      'css-loader',
                      'sass-loader',
                  ]
              }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        plugins: [
            new TsconfigPathsPlugin(),
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].min.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Kami-sama ~',
            template: 'src/popup.ejs',
            filename: 'popup.html',
            chunksSortMode: 'manual',
            chunks: ['popup'],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: 'res'},
            ],
        }),
    ]
}

export default config;
