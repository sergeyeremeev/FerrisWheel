const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, './app'),
    entry: './app.js',
    output: {
        path: path.resolve(__dirname, './dist/assets/'),
        publicPath: 'assets',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                url: false
                            }
                        },
                        {
                            loader: 'postcss-loader'
                        },
                    ]
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({filename: 'style.css', allChunks: false}),
        //new StyleLintPlugin()
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        port: 9000,
        inline: true
    }
};